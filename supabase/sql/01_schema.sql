-- Supabase schema for Rahba (multi-tenant) - Phase 1 minimal core
-- Requires: extension pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1) Profiles (linked to auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('super_admin','admin','tenant','customer')) default 'customer',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2) Plans
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price_dzd integer not null default 0,
  features jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) Tenants
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null check (status in ('ACTIVE','TRIAL','SUSPENDED','EXPIRED')) default 'TRIAL',
  trial_ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_tenants_owner on public.tenants(owner_user_id);

-- 4) Tenant members
create table if not exists public.tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','staff')) default 'owner',
  created_at timestamptz default now(),
  unique(tenant_id, user_id)
);
create index if not exists idx_tenant_members_tenant on public.tenant_members(tenant_id);

-- 5) Subscription requests (manual proof)
create table if not exists public.subscription_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  email text not null,
  plan_id uuid references public.plans(id) on delete set null,
  proof_url text,
  status text not null check (status in ('PENDING','APPROVED','REJECTED')) default 'PENDING',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_subscription_requests_tenant on public.subscription_requests(tenant_id);

-- 6) Subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null check (status in ('TRIAL','ACTIVE','PENDING_PAYMENT','EXPIRED','CANCELLED')) default 'TRIAL',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7) Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  price numeric(10,2) not null default 0,
  compare_price numeric(10,2),
  sku text,
  barcode text,
  published boolean not null default true,
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, slug)
);
create index if not exists idx_products_tenant on public.products(tenant_id);
create index if not exists idx_products_published on public.products(published);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort int not null default 0,
  created_at timestamptz default now()
);
create index if not exists idx_product_images_product on public.product_images(product_id);

-- 8) Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_number text not null unique,
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  wilaya text not null,
  commune text,
  address text not null,
  status text not null check (status in ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED')) default 'PENDING',
  subtotal numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_orders_tenant on public.orders(tenant_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  quantity int not null,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  created_at timestamptz default now()
);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- 9) Extensions
create table if not exists public.extensions (
  key text primary key,
  name text not null,
  description text
);

create table if not exists public.tenant_extensions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  extension_key text not null references public.extensions(key) on delete cascade,
  enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  sheet_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, extension_key)
);
create index if not exists idx_tenant_extensions_tenant on public.tenant_extensions(tenant_id);

-- 10) Shipping
create table if not exists public.shipping_companies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  company_id uuid not null references public.shipping_companies(id) on delete cascade,
  zone_id uuid not null references public.shipping_zones(id) on delete cascade,
  price numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

-- 11) Platform settings
create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 12) Storage usage snapshot per tenant (optional cache)
create table if not exists public.storage_usage (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bytes bigint not null default 0,
  files_count integer not null default 0,
  computed_at timestamptz not null default now(),
  unique(tenant_id)
);

-- Seed default plans (free, 1500, 2500)
insert into public.plans (id, name, price_dzd, features, active)
values
  (gen_random_uuid(), 'FREE', 0, '{}'::jsonb, true),
  (gen_random_uuid(), '1500_DZD', 1500, '{}'::jsonb, true),
  (gen_random_uuid(), '2500_DZD', 2500, '{}'::jsonb, true)
on conflict (name) do nothing;
