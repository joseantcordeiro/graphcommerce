import { Module } from '@nestjs/common';
import { CategoryService } from '../../service/category';
import { CategoryController } from '../../controller/category';
import { BullModule } from '@nestjs/bull';

@Module({
	imports: [
		BullModule.registerQueue({
      name: 'search',
    }),
	],
  providers: [CategoryService],
  controllers: [CategoryController],
	exports: [],
})
export class CategoryModule {}