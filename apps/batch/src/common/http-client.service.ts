import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private readonly MAX_RETRY = 3;

  async fetchWithRetry<T>(url: string, params: Record<string, string>): Promise<T> {
    for (let attempt = 1; attempt <= this.MAX_RETRY; attempt++) {
      try {
        const response = await axios.get<T>(url, { params });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 429) {
            const retryAfter = Number(error.response?.headers['retry-after'] ?? 60);
            this.logger.warn(`[429] Rate limited. Waiting ${retryAfter}s... (attempt ${attempt})`);
            await this.sleep(retryAfter * 1000);
            continue;
          }
          if (attempt < this.MAX_RETRY) {
            const backoff = 1000 * Math.pow(2, attempt - 1);
            this.logger.warn(`HTTP ${status ?? 'error'} on attempt ${attempt}. Retrying in ${backoff}ms...`);
            await this.sleep(backoff);
            continue;
          }
        }
        throw error;
      }
    }
    throw new Error(`Max retry exceeded: ${url}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
