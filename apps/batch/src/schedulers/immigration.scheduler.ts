import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BudgetService } from '../common/budget.service';

@Injectable()
export class ImmigrationScheduler {
  private readonly logger = new Logger(ImmigrationScheduler.name);

  constructor(
    @InjectQueue('immigration') private readonly queue: Queue,
    private readonly budgetService: BudgetService,
  ) {}

  @Cron('0 */2 * * * *')
  async scheduleImmigration() {
    if (await this.budgetService.isExceeded('IMMIGRATION')) {
      this.logger.warn('IMMIGRATION budget exceeded, skipping');
      return;
    }
    await this.queue.add('immigration-arrival', { direction: 'ARRIVAL', airportCode: 'ICN' });
    await this.queue.add('immigration-departure', { direction: 'DEPARTURE', airportCode: 'ICN' });
  }
}
