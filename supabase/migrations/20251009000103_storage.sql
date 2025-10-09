-- Migration: storage buckets & policies (tenant-isolated)

-- Create buckets
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('payment-proofs', 'payment-proofs', false),
  ('tenant-logos', 'tenant-logos', true)
on conflict (id) do nothing;

-- Storage policies
-- Allow public read for product images and tenant logos
drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read
on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists tenant_logos_public_read on storage.objects;
create policy tenant_logos_public_read
on storage.objects for select using (bucket_id = 'tenant-logos');

-- Allow authenticated users to read their tenant files (generic)
drop policy if exists objects_auth_read_membership on storage.objects;
create policy objects_auth_read_membership
on storage.objects for select to authenticated using (
  exists (
    select 1 from public.tenant_members tm
    where tm.user_id = auth.uid()
      and (
        -- path like '<bucket>/<tenantId>/...'; storage.objects.name stores path within bucket
        position((tm.tenant_id)::text || '/' in name) = 1
      )
  )
);

-- Allow writes for tenant members to their own prefix
drop policy if exists objects_auth_write_membership on storage.objects;
create policy objects_auth_write_membership
on storage.objects for insert to authenticated with check (
  exists (
    select 1 from public.tenant_members tm
    where tm.user_id = auth.uid()
      and (
        position((tm.tenant_id)::text || '/' in name) = 1
      )
  )
);

drop policy if exists objects_auth_update_membership on storage.objects;
create policy objects_auth_update_membership
on storage.objects for update to authenticated using (
  exists (
    select 1 from public.tenant_members tm
    where tm.user_id = auth.uid()
      and (
        position((tm.tenant_id)::text || '/' in name) = 1
      )
  )
) with check (
  exists (
    select 1 from public.tenant_members tm
    where tm.user_id = auth.uid()
      and (
        position((tm.tenant_id)::text || '/' in name) = 1
      )
  )
);

drop policy if exists objects_auth_delete_membership on storage.objects;
create policy objects_auth_delete_membership
on storage.objects for delete to authenticated using (
  exists (
    select 1 from public.tenant_members tm
    where tm.user_id = auth.uid()
      and (
        position((tm.tenant_id)::text || '/' in name) = 1
      )
  )
);
