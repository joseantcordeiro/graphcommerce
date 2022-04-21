import { Global, Module } from '@nestjs/common';
import { PersonService } from '../../service/person';
import { PersonController } from '../../controller/person';
import { MinioClientModule } from '../minio-client';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
	imports: [
		MinioClientModule,
		BullModule.registerQueue({
      name: 'person',
    }),
		BullModule.registerQueue({
      name: 'picture',
    }),
		BullModule.registerQueue({
      name: 'mail',
    }),
	],
  providers: [PersonService],
  controllers: [PersonController],
	exports: [PersonService],
})
export class PersonModule {}
