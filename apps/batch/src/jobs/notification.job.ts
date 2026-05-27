import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { DeviceRepository } from '../repositories/device.repository';
import { NotificationLogRepository } from '../repositories/notification-log.repository';
import { NotificationLogEntity } from '../entities/notification-log.entity';
import { BatchLogEntity } from '../common/batch-log.entity';

@Processor('notification')
@Injectable()
export class NotificationJob extends WorkerHost {
  private readonly logger = new Logger(NotificationJob.name);
  private firebaseApp?: admin.app.App;

  constructor(
    private readonly deviceRepo: DeviceRepository,
    private readonly notifLogRepo: NotificationLogRepository,
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    private readonly config: ConfigService,
  ) {
    super();
    this.initFirebase();
  }

  private initFirebase() {
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');
    if (!projectId) return;
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.config.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      }),
    });
  }

  async process(job: Job): Promise<void> {
    const { flightNo, airportCode, prevStatus, newStatus } = job.data as {
      flightNo: string;
      airportCode: string;
      prevStatus: string;
      newStatus: string;
    };

    const notifyType = this.resolveNotifyType(newStatus);
    if (!notifyType) return;

    const devices = await this.deviceRepo.findPushTokensByFlightNo(flightNo, airportCode);

    for (const device of devices) {
      if (!device.pushToken) continue;
      if (notifyType === 'DELAY' && !device.notifyDelay) continue;
      if (notifyType === 'CANCEL' && !device.notifyCancel) continue;
      if (notifyType === 'BOARDING' && !device.notifyBoarding) continue;

      const log = new NotificationLogEntity();
      log.deviceId = device.deviceId;
      log.flightNo = flightNo;
      log.notifyType = notifyType;
      log.title = this.buildTitle(flightNo, newStatus);
      log.body = this.buildBody(flightNo, prevStatus, newStatus);

      try {
        if (this.firebaseApp) {
          await admin.messaging(this.firebaseApp).send({
            token: device.pushToken,
            notification: { title: log.title, body: log.body ?? undefined },
            data: { flightNo, airportCode, status: newStatus },
          });
          log.isSent = 1;
          log.sentAt = new Date();
        }
      } catch (error) {
        log.isSent = 0;
        log.errorMsg = error instanceof Error ? error.message : String(error);
        this.logger.error(`FCM send failed for ${device.deviceId}: ${log.errorMsg}`);
      }

      await this.notifLogRepo.save(log);
    }
  }

  private resolveNotifyType(status: string): string | null {
    if (status === 'DELAYED') return 'DELAY';
    if (status === 'CANCELLED') return 'CANCEL';
    if (status === 'BOARDING') return 'BOARDING';
    return null;
  }

  private buildTitle(flightNo: string, status: string): string {
    const labels: Record<string, string> = {
      DELAYED: '지연', CANCELLED: '결항', BOARDING: '탑승',
    };
    return `${flightNo} ${labels[status] ?? status}`;
  }

  private buildBody(flightNo: string, prevStatus: string, newStatus: string): string {
    return `${flightNo} 편이 ${prevStatus} → ${newStatus} 상태로 변경되었습니다.`;
  }
}
