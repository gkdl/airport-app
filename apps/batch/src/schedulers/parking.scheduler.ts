import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BudgetService } from '../common/budget.service';

@Injectable()
export class ParkingScheduler {
  private readonly logger = new Logger(ParkingScheduler.name);

  constructor(
    @InjectQueue('incheon-parking') private readonly incheonQueue: Queue,
    @InjectQueue('kac-parking') private readonly kacQueue: Queue,
    private readonly budgetService: BudgetService,
  ) {}

  @Cron('0 */3 * * * *')
  async scheduleIncheonParking() {
    if (await this.budgetService.isExceeded('INCHEON_PARKING')) {
      this.logger.warn('INCHEON_PARKING budget exceeded, skipping');
      return;
    }
    await this.incheonQueue.add('incheon-parking', {});
  }

  @Cron('30 */3 * * * *')
  async scheduleKacParking() {
    if (await this.budgetService.isExceeded('KAC_PARKING')) {
      this.logger.warn('KAC_PARKING budget exceeded, skipping');
      return;
    }
    const airports = ['GMP','PUS','CJU','TAE','CJJ','MWX','YNY','USN','KWJ','RSU','KPO','HIN','KUV','WJU'];
    for (const airportCode of airports) {
      await this.kacQueue.add('kac-parking', { airportCode });
    }
  }
}
