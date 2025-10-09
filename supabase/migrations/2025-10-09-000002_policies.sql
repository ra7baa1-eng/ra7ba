-- Migration: RLS policies (embedded)
-- 0) Helpers
create or replace function public.is_super_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'super_admin'
  );
$$;

-- 1) Profiles
alter table public.profiles enable row level security;

create policy if not exists profiles_read_own
on public.profiles for select to authenticated
using (user_id = auth.uid());

create policy if not exists profiles_update_own
on public.profiles for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 2) Tenants
alter table public.tenants enable row level security;

create policy if not exists tenants_read_membership
on public.tenants for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = tenants.id and tm.user_id = auth.uid()
  )
);

-- 3) Tenant members
alter table public.tenant_members enable row level security;

create policy if not exists tenant_members_read_membership
on public.tenant_members for select to authenticated
using (
  public.is_super_admin() OR tenant_members.user_id = auth.uid() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = tenant_members.tenant_id and tm.user_id = auth.uid()
  )
);

-- 4) Products
alter table public.products enable row level security;

-- Public can read only published products (storefront)
create policy if not exists products_public_read_published
on public.products for select to public
using (published = true);

-- Tenant members can read all their products
create policy if not exists products_members_read
on public.products for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = products.tenant_id and tm.user_id = auth.uid()
  )
);

-- Write access for tenant members
create policy if not exists products_members_write
on public.products for all to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = products.tenant_id and tm.user_id = auth.uid()
  )
) with check (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = products.tenant_id and tm.user_id = auth.uid()
  )
);

-- 5) Product images
alter table public.product_images enable row level security;
create policy if not exists product_images_members_read
on public.product_images for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.products p
    join public.tenant_members tm on tm.tenant_id = p.tenant_id
    where p.id = product_images.product_id and tm.user_id = auth.uid()
  )
);
create policy if not exists product_images_members_write
on public.product_images for all to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.products p
    join public.tenant_members tm on tm.tenant_id = p.tenant_id
    where p.id = product_images.product_id and tm.user_id = auth.uid()
  )
) with check (
  public.is_super_admin() OR
  exists (
    select 1 from public.products p
    join public.tenant_members tm on tm.tenant_id = p.tenant_id
    where p.id = product_images.product_id and tm.user_id = auth.uid()
  )
);

-- 6) Orders
alter table public.orders enable row level security;
create policy if not exists orders_members_read
on public.orders for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = orders.tenant_id and tm.user_id = auth.uid()
  )
);

alter table public.order_items enable row level security;
create policy if not exists order_items_members_read
on public.order_items for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.orders o
    join public.tenant_members tm on tm.tenant_id = o.tenant_id
    where o.id = order_items.order_id and tm.user_id = auth.uid()
  )
);

-- 7) Extensions
alter table public.extensions enable row level security;
create policy if not exists extensions_read_all
on public.extensions for select to public
using (true);

alter table public.tenant_extensions enable row level security;
create policy if not exists tenant_extensions_read_membership
on public.tenant_extensions for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = tenant_extensions.tenant_id and tm.user_id = auth.uid()
  )
);

-- 8) Settings
alter table public.platform_settings enable row level security;
-- no public access; service role will manage settings

-- 9) Subscriptions / Requests
alter table public.subscriptions enable row level security;
alter table public.subscription_requests enable row level security;
-- No public policies; service role handles writes

-- 10) Shipping tables
alter table public.shipping_companies enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.shipping_rates enable row level security;

create policy if not exists shipping_members_read_companies
on public.shipping_companies for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = shipping_companies.tenant_id and tm.user_id = auth.uid()
  )
);
create policy if not exists shipping_members_read_zones
on public.shipping_zones for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = shipping_zones.tenant_id and tm.user_id = auth.uid()
  )
);
create policy if not exists shipping_members_read_rates
on public.shipping_rates for select to authenticated
using (
  public.is_super_admin() OR
  exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = shipping_rates.tenant_id and tm.user_id = auth.uid()
  )
);
