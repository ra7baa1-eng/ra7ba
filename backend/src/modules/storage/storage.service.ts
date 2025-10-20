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
    const supabaseUrl = this.config.get('SUPABASE_URL');
    const supabaseKey = this.config.get('SUPABASE_KEY');

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      this.useLocal = true;
      this.localStoragePath = path.join(process.cwd(), 'uploads');
      
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
    const startTime = Date.now();
    console.log(`[uploadFile] Start upload to ${this.useLocal ? 'local' : 'Supabase'}, size: ${file.size} bytes`);
    
    try {
      const url = this.useLocal 
        ? await this.uploadLocal(file, folder)
        : await this.uploadToSupabase(file, folder);
      
      console.log(`[uploadFile] Completed in ${Date.now() - startTime}ms`);
      return url;
    } catch (error) {
      console.error(`[uploadFile] Failed after ${Date.now() - startTime}ms:`, error);
      throw error;
    }
  }

  private async uploadToSupabase(
    file: any,
    folder: string,
  ): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const bucket = this.config.get('SUPABASE_BUCKET', 'rahba-storage');
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const fileContent = file.buffer ?? fs.readFileSync(file.path);
    console.log(`[uploadToSupabase] Uploading ${fileName}, size: ${fileContent.length} bytes`);

    let { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, fileContent, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      // Try to create bucket and retry once (requires service_role key)
      try {
        await this.supabase.storage.createBucket(bucket, { public: true });
        const retry = await this.supabase.storage
          .from(bucket)
          .upload(fileName, fileContent, {
            contentType: file.mimetype,
            upsert: false,
          });
        data = retry.data as any;
        error = retry.error as any;
      } catch (_) {}
    }

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

    const fileBuffer = file.buffer ?? fs.readFileSync(file.path);
    fs.writeFileSync(filePath, fileBuffer);

    // Return URL path (will be served by express.static)
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

    const bucket = this.config.get('SUPABASE_BUCKET', 'rahba-storage');
    
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts.slice(-2).join('/'); // folder/filename

    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Delete failed:', error);
    }
  }

  private async deleteLocal(fileUrl: string): Promise<void> {
    const filePath = path.join(process.cwd(), fileUrl);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
