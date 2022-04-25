import { Module } from '@nestjs/common';
import { CategoryService } from '../../service/category';
import { CategoryController } from '../../controller/category';
import { MinioClientModule } from '../minio-client';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		MinioClientModule,
		BullModule.registerQueue({
      name: 'search',
    }),
	],
  providers: [CategoryService],
  controllers: [CategoryController],
	exports: [],
})
export class CategoryModule {}