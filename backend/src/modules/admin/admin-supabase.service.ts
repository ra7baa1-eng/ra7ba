import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class AdminSupabaseService {
  constructor(private readonly supabase: SupabaseService) {}

  // Dashboard Stats
  async getDashboardStats() {
    const { data: tenants } = await this.supabase.client
      .from('tenants')
      .select('id, status');
    
    const { data: subscriptions } = await this.supabase.client
      .from('subscriptions')
      .select('id, status');
    
    const { data: products } = await this.supabase.client
      .from('products')
      .select('id');
    
    const { data: orders } = await this.supabase.client
      .from('orders')
      .select('id, total, created_at');

    const activeTenantsCount = tenants?.filter(t => t.status === 'ACTIVE').length || 0;
    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

    return {
      totalTenants: tenants?.length || 0,
      activeTenants: activeTenantsCount,
      totalProducts: products?.length || 0,
      totalOrders: orders?.length || 0,
      totalRevenue,
      pendingSubscriptions: subscriptions?.filter(s => s.status === 'PENDING_PAYMENT').length || 0,
    };
  }

  // Tenants Management
  async getAllTenants(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase.client
      .from('tenants')
      .select(`
        *,
        owner:profiles!tenants_owner_user_id_fkey(user_id, full_name),
        plan:plans(name, price_dzd),
        subscription:subscriptions(status, current_period_end)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { tenants: data, total: count };
  }

  async getTenantById(tenantId: string) {
    const { data, error } = await this.supabase.client
      .from('tenants')
      .select(`
        *,
        owner:profiles!tenants_owner_user_id_fkey(user_id, full_name, role),
        plan:plans(*),
        subscription:subscriptions(*),
        members:tenant_members(
          id,
          role,
          user:profiles(user_id, full_name)
        )
      `)
      .eq('id', tenantId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateTenantStatus(tenantId: string, status: string) {
    const { data, error } = await this.supabase.client
      .from('tenants')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', tenantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTenant(tenantId: string) {
    const { error } = await this.supabase.client
      .from('tenants')
      .delete()
      .eq('id', tenantId);

    if (error) throw error;
    return { success: true };
  }

  // Subscription Requests (Payment Proof)
  async getSubscriptionRequests(status?: string) {
    let query = this.supabase.client
      .from('subscription_requests')
      .select(`
        *,
        tenant:tenants(id, name, slug),
        plan:plans(name, price_dzd)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async approveSubscriptionRequest(requestId: string) {
    // Get request details
    const { data: request, error: reqError } = await this.supabase.client
      .from('subscription_requests')
      .select('*, tenant:tenants(id)')
      .eq('id', requestId)
      .single();

    if (reqError) throw reqError;

    // Update request status
    await this.supabase.client
      .from('subscription_requests')
      .update({ status: 'APPROVED', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    // Update or create subscription
    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { error: subError } = await this.supabase.client
      .from('subscriptions')
      .upsert({
        tenant_id: request.tenant_id,
        plan_id: request.plan_id,
        status: 'ACTIVE',
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (subError) throw subError;

    // Update tenant status
    await this.supabase.client
      .from('tenants')
      .update({ status: 'ACTIVE', updated_at: new Date().toISOString() })
      .eq('id', request.tenant_id);

    return { success: true };
  }

  async rejectSubscriptionRequest(requestId: string) {
    const { error } = await this.supabase.client
      .from('subscription_requests')
      .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) throw error;
    return { success: true };
  }

  // Products Management
  async getAllProducts(page = 1, limit = 20, tenantId?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase.client
      .from('products')
      .select(`
        *,
        tenant:tenants(id, name, slug),
        images:product_images(id, url, sort)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { products: data, total: count };
  }

  async deleteProduct(productId: string) {
    const { error } = await this.supabase.client
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  }

  // Users Management
  async getAllUsers(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase.client
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { users: data, total: count };
  }

  async updateUserRole(userId: string, role: string) {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Extensions Management
  async getAllExtensions() {
    const { data, error } = await this.supabase.client
      .from('extensions')
      .select('*')
      .order('key');

    if (error) throw error;
    return data;
  }

  async getTenantExtensions(tenantId: string) {
    const { data, error } = await this.supabase.client
      .from('tenant_extensions')
      .select(`
        *,
        extension:extensions(*)
      `)
      .eq('tenant_id', tenantId);

    if (error) throw error;
    return data;
  }

  // Shipping Management
  async getShippingCompanies(tenantId?: string) {
    let query = this.supabase.client
      .from('shipping_companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Storage Usage
  async getStorageUsage(tenantId?: string) {
    let query = this.supabase.client
      .from('storage_usage')
      .select(`
        *,
        tenant:tenants(id, name, slug)
      `)
      .order('bytes', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateStorageUsage(tenantId: string) {
    // Calculate storage from Supabase Storage
    const { data: files } = await this.supabase.client.storage
      .from('product-images')
      .list(tenantId);

    const totalBytes = files?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0;
    const filesCount = files?.length || 0;

    const { error } = await this.supabase.client
      .from('storage_usage')
      .upsert({
        tenant_id: tenantId,
        bytes: totalBytes,
        files_count: filesCount,
        computed_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { bytes: totalBytes, files_count: filesCount };
  }

  // Platform Settings
  async getPlatformSettings() {
    const { data, error } = await this.supabase.client
      .from('platform_settings')
      .select('*')
      .order('key');

    if (error) throw error;
    return data;
  }

  async updatePlatformSetting(key: string, value: any, description?: string) {
    const { data, error } = await this.supabase.client
      .from('platform_settings')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Reports
  async getOrdersReport(startDate?: string, endDate?: string, tenantId?: string) {
    let query = this.supabase.client
      .from('orders')
      .select(`
        *,
        tenant:tenants(id, name, slug),
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
