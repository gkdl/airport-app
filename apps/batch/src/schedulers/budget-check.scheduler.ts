import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BudgetService } from '../common/budget.service';

const JOB_NAMES = ['INCHEON_FLIGHT', 'KAC_FLIGHT', 'INCHEON_PARKING', 'KAC_PARKING', 'IMMIGRATION', 'WEATHER'];

@Injectable()
export class BudgetCheckScheduler {
  private readonly logger = new Logger(BudgetCheckScheduler.name);

  constructor(private readonly budgetService: BudgetService) {}

  @Cron('1 0 * * *')
  async dailyBudgetReport() {
    this.logger.log('=== Daily Budget Report ===');
    for (const jobName of JOB_NAMES) {
      const count = await this.budgetService.getTodayCallCount(jobName);
      this.logger.log(`${jobName}: ${count} calls today`);
    }
  }
}
