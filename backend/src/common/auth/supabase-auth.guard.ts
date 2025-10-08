import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: any; profile?: any }>();

    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;

    if (!token) {
      throw new UnauthorizedException('Missing Authorization bearer token');
    }

    const user = await this.supabase.getUserFromAccessToken(token);
    if (!user) throw new UnauthorizedException('Invalid access token');

    const profile = await this.supabase.getProfile(user.id).catch(() => null);

    // Attach to request for controllers/services
    (req as any).user = user;
    (req as any).profile = profile;

    return true;
  }
}
