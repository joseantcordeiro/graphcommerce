import { Module } from '@nestjs/common';
import { MinioClientModule } from '../../module/minio-client';
import { ImageUploadController } from '../../controller/image-upload';
import { ImageUploadService } from '../../service/image-upload';

@Module({
  imports: [MinioClientModule],
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}