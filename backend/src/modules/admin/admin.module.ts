import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSupabaseController } from './admin-supabase.controller';
import { AdminSupabaseService } from './admin-supabase.service';

@Module({
  controllers: [AdminController, AdminSupabaseController],
  providers: [AdminService, AdminSupabaseService],
  exports: [AdminService, AdminSupabaseService],
})
export class AdminModule {}
