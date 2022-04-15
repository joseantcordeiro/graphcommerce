import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailProcessor } from '../../processor/mail';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [],
  providers: [MailProcessor],
})
export class MailModule {}