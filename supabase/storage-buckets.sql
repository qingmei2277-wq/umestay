-- ─────────────────────────────────────────────────────────────────────────────
-- UMESTAY Storage Buckets
--
-- Run this in the Supabase SQL Editor AFTER the initial schema migration.
-- (storage.buckets is not part of the regular migration flow)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Buckets ───────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  (
    'property-images',
    'property-images',
    true,
    10485760,  -- 10 MB
    ARRAY['image/jpeg','image/png','image/webp','image/avif']
  ),
  (
    'avatars',
    'avatars',
    true,
    5242880,   -- 5 MB
    ARRAY['image/jpeg','image/png','image/webp']
  ),
  (
    'kyc-documents',
    'kyc-documents',
    false,
    20971520,  -- 20 MB
    ARRAY['image/jpeg','image/png','application/pdf']
  ),
  (
    'contracts',
    'contracts',
    false,
    20971520,  -- 20 MB
    ARRAY['application/pdf']
  ),
  (
    'invoices',
    'invoices',
    false,
    10485760,  -- 10 MB
    ARRAY['application/pdf']
  )
ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS Policies ──────────────────────────────────────────────────────

-- property-images: public read, authenticated write (owner or admin)
CREATE POLICY "property_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "property_images_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "property_images_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.uid() = owner
  );

-- avatars: public read, owner write
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_owner_upsert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- kyc-documents: owner read/write + operator/super_admin read
CREATE POLICY "kyc_owner_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth_role() IN ('operator', 'super_admin')
    )
  );

CREATE POLICY "kyc_owner_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- contracts: owner read + operator/super_admin full access
CREATE POLICY "contracts_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contracts'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth_role() IN ('operator', 'super_admin')
    )
  );

CREATE POLICY "contracts_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contracts'
    AND auth_role() IN ('operator', 'super_admin')
  );

-- invoices: owner read + operator/super_admin full access
CREATE POLICY "invoices_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'invoices'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth_role() IN ('operator', 'super_admin')
    )
  );

CREATE POLICY "invoices_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'invoices'
    AND auth_role() IN ('operator', 'super_admin')
  );
