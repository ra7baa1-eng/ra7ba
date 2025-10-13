import { Controller, Post, UseGuards, UploadedFile, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Upload a file to storage (Supabase or local)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder = 'products',
  ) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const url = await this.storage.uploadFile(file, folder);
    return { url };
  }
}
