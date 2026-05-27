import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BatchLogEntity } from './batch-log.entity';

@Injectable()
export class BudgetService {
  private readonly logger = new Logger(BudgetService.name);

  private readonly DAILY_BUDGET: Record<string, number> = {
    INCHEON_FLIGHT:   800,
    KAC_FLIGHT:     4000,
    INCHEON_PARKING:  800,
    KAC_PARKING:    4000,
    IMMIGRATION:      400,
    WEATHER:        8000,
  };

  constructor(
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    private readonly config: ConfigService,
  ) {}

  async isExceeded(jobName: string): Promise<boolean> {
    const todayCount = await this.getTodayCallCount(jobName);
    const budget = this.DAILY_BUDGET[jobName] ?? Infinity;
    if (todayCount >= budget * 0.8) {
      await this.sendAlert(jobName, todayCount, budget);
    }
    return todayCount >= budget;
  }

  async getTodayCallCount(jobName: string): Promise<number> {
    const result = await this.batchLogRepo
      .createQueryBuilder('l')
      .select('COUNT(*)', 'cnt')
      .where('l.jobName = :jobName', { jobName })
      .andWhere("TRUNC(l.startedAt) = TRUNC(SYSDATE)")
      .getRawOne<{ cnt: string }>();
    return parseInt(result?.cnt ?? '0', 10);
  }

  private async sendAlert(jobName: string, current: number, budget: number): Promise<void> {
    const webhookUrl = this.config.get<string>('SLACK_WEBHOOK_URL');
    if (!webhookUrl) return;
    try {
      await axios.post(webhookUrl, {
        text: `⚠️ [Budget Alert] ${jobName}: ${current}/${budget} calls today (${Math.round(current / budget * 100)}%)`,
      });
    } catch {
      this.logger.error(`Failed to send Slack alert for ${jobName}`);
    }
  }
}
