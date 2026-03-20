-- ─────────────────────────────────────────────────────────────────────────────
-- UMESTAY Seed Data (dev / staging only)
--
-- Derived from prototype mock data (umestay_lake_v9.jsx)
-- Schema: supabase_schema_v2.sql
--
-- Apply:
--   supabase db reset          (migrations + seed in one step)
-- or
--   psql $DATABASE_URL -f supabase/seed/seed.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Auth users (supabase.auth.users) ──────────────────────────────────────
-- These UUIDs are fixed so seed data can reference them deterministically.

INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@umestay.dev',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"管理者"}',
    now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'host@umestay.dev',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"テスト房東"}',
    now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'guest@umestay.dev',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"テストゲスト"}',
    now(), now()
  )
ON CONFLICT (id) DO NOTHING;

-- ── 2. Profiles ───────────────────────────────────────────────────────────────

INSERT INTO profiles (user_id, name, phone, status, role, is_finance, preferred_lang) VALUES
  ('00000000-0000-0000-0000-000000000001', '管理者',       '+81-90-0000-0001', 'active', 'super_admin', false, 'ja'),
  ('00000000-0000-0000-0000-000000000002', 'テスト房東',   '+81-90-0000-0002', 'active', 'host',        false, 'ja'),
  ('00000000-0000-0000-0000-000000000003', 'テストゲスト', '+81-90-0000-0003', 'active', 'guest',       false, 'zh')
ON CONFLICT (user_id) DO NOTHING;

-- ── 3. Host profile ───────────────────────────────────────────────────────────

INSERT INTO host_profiles (
  user_id, stripe_connect_status, payout_schedule, business_type
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'pending',
  'after_checkin',
  'individual'
) ON CONFLICT (user_id) DO NOTHING;

-- ── 4. Properties (6 prototype listings) ─────────────────────────────────────

INSERT INTO properties (
  id, owner_id, managed_by, type,
  title_ja, title_zh, title_en,
  description_ja, description_zh, description_en,
  prefecture, city, address_detail,
  price_daily, price_monthly,
  max_guests,
  status, license_number
) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'host',
    'daily',
    '新宿 テラスルーム',
    '新宿露台房',
    'Shinjuku Terrace Room',
    '新宿駅徒歩5分。広いテラス付きの明るいお部屋です。',
    '距新宿站步行5分钟，带宽敞露台的明亮房间。',
    '5-min walk from Shinjuku Station. Bright room with spacious terrace.',
    '東京都', '新宿区', '新宿3丁目',
    12000, NULL,
    2,
    'active', 'M-Tokyo-00001'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'host',
    'daily',
    '池袋 サニーワン',
    '池袋阳光公寓',
    'Ikebukuro Sunny One',
    '池袋駅徒歩3分。陽当たり抜群のコンパクトルーム。',
    '距池袋站步行3分钟，采光极佳的精致小房间。',
    '3-min walk from Ikebukuro Station. Compact room with excellent sunlight.',
    '東京都', '豊島区', '南池袋1丁目',
    9800, NULL,
    2,
    'active', 'M-Tokyo-00002'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    NULL,
    'platform',
    'daily',
    '渋谷 プレミアムスイート',
    '涩谷高级套房',
    'Shibuya Premium Suite',
    '渋谷スクランブル交差点まで徒歩2分。最上階の高級スイート。',
    '距涩谷十字路口步行2分钟，顶层豪华套房。',
    '2-min walk from Shibuya Scramble. Luxury top-floor suite.',
    '東京都', '渋谷区', '道玄坂2丁目',
    28000, NULL,
    4,
    'active', 'M-Tokyo-00003'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    NULL,
    'platform',
    'monthly',
    '恵比寿 ラグジュアリー1LDK',
    '惠比寿豪华一居室',
    'Ebisu Luxury 1LDK',
    '恵比寿駅徒歩7分。高級感あふれる1LDKマンション。',
    '距惠比寿站步行7分钟，高端1LDK公寓。',
    '7-min walk from Ebisu Station. Luxurious 1LDK apartment.',
    '東京都', '渋谷区', '恵比寿南1丁目',
    NULL, 180000,
    2,
    'active', NULL
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000002',
    'host',
    'daily',
    '中野 コンパクトルーム',
    '中野经济小屋',
    'Nakano Compact Room',
    '中野駅徒歩4分。リーズナブルな一人旅向けルーム。',
    '距中野站步行4分钟，适合单人旅行的经济型房间。',
    '4-min walk from Nakano Station. Affordable room for solo travelers.',
    '東京都', '中野区', '中野5丁目',
    7500, NULL,
    1,
    'active', 'M-Tokyo-00004'
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    NULL,
    'platform',
    'monthly',
    '吉祥寺 ガーデンビュー',
    '吉祥寺花园景观',
    'Kichijoji Garden View',
    '吉祥寺駅徒歩8分。井の頭公園を望む緑あふれる物件。',
    '距吉祥寺站步行8分钟，可眺望井之头公园的绿意盎然公寓。',
    '8-min walk from Kichijoji Station. Lush apartment overlooking Inokashira Park.',
    '東京都', '武蔵野市', '吉祥寺南町1丁目',
    NULL, 155000,
    2,
    'active', NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ── 5. Amenities ──────────────────────────────────────────────────────────────

INSERT INTO amenities (property_id, category, name) VALUES
  -- 新宿 テラスルーム
  ('10000000-0000-0000-0000-000000000001', 'room',     'WiFi'),
  ('10000000-0000-0000-0000-000000000001', 'room',     'エアコン'),
  ('10000000-0000-0000-0000-000000000001', 'room',     'テレビ'),
  ('10000000-0000-0000-0000-000000000001', 'kitchen',  '電子レンジ'),
  ('10000000-0000-0000-0000-000000000001', 'laundry',  '洗濯機'),
  -- 池袋 サニーワン
  ('10000000-0000-0000-0000-000000000002', 'room',     'WiFi'),
  ('10000000-0000-0000-0000-000000000002', 'room',     'エアコン'),
  ('10000000-0000-0000-0000-000000000002', 'kitchen',  '電子レンジ'),
  -- 渋谷 プレミアムスイート
  ('10000000-0000-0000-0000-000000000003', 'room',     'WiFi'),
  ('10000000-0000-0000-0000-000000000003', 'room',     'エアコン'),
  ('10000000-0000-0000-0000-000000000003', 'room',     'テレビ'),
  ('10000000-0000-0000-0000-000000000003', 'bathroom', 'バスタブ'),
  ('10000000-0000-0000-0000-000000000003', 'kitchen',  '食器洗い乾燥機'),
  ('10000000-0000-0000-0000-000000000003', 'laundry',  '洗濯乾燥機'),
  -- 恵比寿 ラグジュアリー1LDK
  ('10000000-0000-0000-0000-000000000004', 'room',     'WiFi'),
  ('10000000-0000-0000-0000-000000000004', 'room',     'エアコン'),
  ('10000000-0000-0000-0000-000000000004', 'bathroom', 'バスタブ'),
  ('10000000-0000-0000-0000-000000000004', 'kitchen',  'フルキッチン'),
  ('10000000-0000-0000-0000-000000000004', 'laundry',  '洗濯乾燥機'),
  -- 中野 コンパクトルーム
  ('10000000-0000-0000-0000-000000000005', 'room',     'WiFi'),
  ('10000000-0000-0000-0000-000000000005', 'room',     'エアコン'),
  ('10000000-0000-0000-0000-000000000005', 'kitchen',  '電子レンジ'),
  -- 吉祥寺 ガーデンビュー
  ('10000000-0000-0000-0000-000000000006', 'room',     'WiFi'),
  ('10000000-0000-0000-0000-000000000006', 'room',     'エアコン'),
  ('10000000-0000-0000-0000-000000000006', 'room',     'テレビ'),
  ('10000000-0000-0000-0000-000000000006', 'kitchen',  'フルキッチン'),
  ('10000000-0000-0000-0000-000000000006', 'laundry',  '洗濯機')
ON CONFLICT DO NOTHING;

-- ── 6. KYC verification (host) ────────────────────────────────────────────────

INSERT INTO kyc_verifications (
  user_id, doc_type, doc_url, status
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'passport',
  'https://placeholder.dev/kyc/passport.jpg',
  'approved'
) ON CONFLICT DO NOTHING;
