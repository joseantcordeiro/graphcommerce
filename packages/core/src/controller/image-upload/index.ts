import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
	UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from '../../service/image-upload';
import { BufferedFile } from '../../entity/file';
import { AuthGuard } from '../../guard/auth';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private imageUploadService: ImageUploadService) {}

	@UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: BufferedFile) {
    return this.imageUploadService.uploadImage(image);
  }

}