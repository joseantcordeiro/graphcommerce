import { Module } from '@nestjs/common';
import { MetadataService } from '../../service/metadata';
import { MetadataController } from '../../controller/metadata';

@Module({
  providers: [MetadataService],
  controllers: [MetadataController]
})
export class MetadataModule {}