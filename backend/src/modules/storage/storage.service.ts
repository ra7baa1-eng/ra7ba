import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { Multer } from 'multer';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient | null = null;
  private useLocal: boolean = false;
  private localStoragePath: string;

  constructor(private config: ConfigService) {
    const driver = (this.config.get<string>('STORAGE_DRIVER') || 'local').toLowerCase();
    if (driver === 'supabase') {
      const supabaseUrl = this.config.get<string>('SUPABASE_URL');
      const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !serviceKey) {
        throw new Error('Supabase storage selected but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
      }

      this.supabase = createClient(supabaseUrl, serviceKey);
      this.useLocal = false;
    } else {
      // Local storage mode
      this.useLocal = true;
      const defaultPath = path.join(process.cwd(), 'uploads');
      this.localStoragePath = this.config.get<string>('STORAGE_LOCAL_PATH') || defaultPath;

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(this.localStoragePath)) {
        fs.mkdirSync(this.localStoragePath, { recursive: true });
      }
    }
  }

  async uploadFile(
    file: any,
    folder: string = 'general',
  ): Promise<string> {
    if (this.useLocal) {
      return this.uploadLocal(file, folder);
    }
    return this.uploadToSupabase(file, folder);
  }

  private async uploadToSupabase(
    file: any,
    folder: string,
  ): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const bucket = this.getBucketForFolder(folder);
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  }

  private async uploadLocal(
    file: any,
    folder: string,
  ): Promise<string> {
    const folderPath = path.join(this.localStoragePath, folder);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    // Return URL path (will be served by express.static)
    // We expose local storage under /uploads regardless of physical STORAGE_LOCAL_PATH
    return `/uploads/${folder}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (this.useLocal) {
      return this.deleteLocal(fileUrl);
    }
    return this.deleteFromSupabase(fileUrl);
  }

  private async deleteFromSupabase(fileUrl: string): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Try to detect bucket from URL path `/object/public/<bucket>/<path>` or `/object/sign/<bucket>/<path>`
    const match = fileUrl.match(/\/object\/(?:public|sign)\/([^/]+)\/(.+)$/);
    let bucket = 'product-images';
    let objectPath = '';
    if (match) {
      bucket = match[1];
      objectPath = match[2];
    } else {
      // Fallback: assume path contains /uploads/<folder>/<file> not applicable to Supabase
      return;
    }

    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([objectPath]);

    if (error) {
      console.error('Delete failed:', error);
    }
  }

  private async deleteLocal(fileUrl: string): Promise<void> {
    // fileUrl is like /uploads/<folder>/<filename>
    const relative = fileUrl.replace(/^\/?uploads\//, '');
    const filePath = path.join(this.localStoragePath, relative);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  private getBucketForFolder(folder: string): string {
    const f = (folder || '').toLowerCase();
    if (f.includes('payment')) return 'payment-proofs';
    if (f.includes('logo')) return 'tenant-logos';
    return 'product-images';
  }
}
