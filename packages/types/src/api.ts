export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    updatedAt: string;
    cachedAt?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
