import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BudgetService } from '../common/budget.service';

@Injectable()
export class FlightRealtimeScheduler {
  private readonly logger = new Logger(FlightRealtimeScheduler.name);

  constructor(
    @InjectQueue('incheon-flight') private readonly incheonQueue: Queue,
    @InjectQueue('kac-flight') private readonly kacQueue: Queue,
    private readonly budgetService: BudgetService,
  ) {}

  @Cron('0 */5 * * * *')
  async scheduleIncheonFlight() {
    if (await this.budgetService.isExceeded('INCHEON_FLIGHT')) {
      this.logger.warn('INCHEON_FLIGHT budget exceeded, skipping');
      return;
    }
    await this.incheonQueue.add('incheon-flight-realtime', {
      terminals: ['P01', 'P02', 'P03'],
      directions: ['DEPARTURE', 'ARRIVAL'],
    });
    this.logger.debug('Incheon flight realtime job queued');
  }

  @Cron('30 */5 * * * *')
  async scheduleKacFlight() {
    if (await this.budgetService.isExceeded('KAC_FLIGHT')) {
      this.logger.warn('KAC_FLIGHT budget exceeded, skipping');
      return;
    }
    const airports = ['GMP','PUS','CJU','TAE','CJJ','MWX','YNY','USN','KWJ','RSU','KPO','HIN','KUV','WJU'];
    for (const airportCode of airports) {
      await this.kacQueue.add('kac-flight-realtime', { airportCode });
    }
    this.logger.debug(`KAC flight jobs queued for ${airports.length} airports`);
  }
}
