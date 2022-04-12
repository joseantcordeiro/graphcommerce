import { Injectable } from '@nestjs/common';
import { MinioClientService } from '../../service/minio-client';
import { BufferedFile } from '../../entity/file';

@Injectable()
export class ImageUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadImage(image: BufferedFile) {
    const uploaded_image = await this.minioClientService.upload(image);

    return {
      image_url: uploaded_image.url,
      message: 'Image upload successful',
    };
  }
}