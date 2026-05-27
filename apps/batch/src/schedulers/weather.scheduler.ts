import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BudgetService } from '../common/budget.service';
import { ALL_AIRPORTS } from '@airport-app/utils';

@Injectable()
export class WeatherScheduler {
  private readonly logger = new Logger(WeatherScheduler.name);

  constructor(
    @InjectQueue('weather') private readonly queue: Queue,
    private readonly budgetService: BudgetService,
  ) {}

  @Cron('0 */30 * * * *')
  async scheduleWeather() {
    if (await this.budgetService.isExceeded('WEATHER')) {
      this.logger.warn('WEATHER budget exceeded, skipping');
      return;
    }
    for (const airport of ALL_AIRPORTS) {
      await this.queue.add('weather', { airportCode: airport.code });
    }
  }
}
