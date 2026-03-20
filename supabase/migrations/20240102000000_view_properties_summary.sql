-- ─────────────────────────────────────────────────────────────────────────────
-- v_properties_summary — 房源摘要视图（供前台列表/搜索/详情使用）
--
-- Run after: 20240101000000_initial_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

create or replace view v_properties_summary as
select
  p.id,
  p.owner_id,
  p.managed_by,
  p.type,
  p.status,

  -- 多语言标题/描述
  p.title_zh,
  p.title_ja,
  p.title_en,
  p.description_zh,
  p.description_ja,
  p.description_en,

  -- 位置
  p.prefecture,
  p.city,
  p.nearest_station,
  p.station_walk_min,
  st_y(p.location::geometry)  as lat,
  st_x(p.location::geometry)  as lng,

  -- 价格
  p.price_daily,
  p.price_monthly,
  p.cleaning_fee,
  p.deposit_amount,

  -- 容量
  p.max_guests,
  p.area_sqm,
  p.floor,

  -- 民泊合规
  p.license_number,
  p.license_expires_at,

  -- 入住规则
  p.checkin_time,
  p.checkout_time,
  p.checkin_method,
  p.cancellation_policy,
  p.house_rules,

  -- 评分（触发器维护）
  p.rating_avg,
  p.review_count,

  -- 封面图（is_cover = true 的第一张）
  ( select pi.url
    from   property_images pi
    where  pi.property_id = p.id
      and  pi.is_cover = true
    limit  1
  ) as cover_image_url,

  p.published_at,
  p.created_at,
  p.updated_at

from properties p;

-- RLS 不直接作用于视图，底层 properties 表的 RLS 依然生效
-- 视图使用 SECURITY INVOKER（默认），会以查询者身份进行权限检查
