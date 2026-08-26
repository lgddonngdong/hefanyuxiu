-- =============================================
-- 植物数据库更新脚本
-- 请在 Supabase SQL 编辑器中执行
-- =============================================

-- Step 1: 添加 is_invasive 字段
ALTER TABLE plants ADD COLUMN IF NOT EXISTS is_invasive boolean DEFAULT false;

-- Step 2: 标记38种为入侵物种
-- 原有外来种中的28种入侵种
UPDATE plants SET is_invasive = true WHERE name_cn IN (
  '喜旱莲子草',   -- Alternanthera philoxeroides
  '豚草',         -- Ambrosia artemisiifolia
  '小蓬草',       -- Conyza canadensis
  '一年蓬',       -- Erigeron annuus
  '苏门白酒草',   -- Conyza sumatrensis
  '钻叶紫菀',     -- Aster subulatus
  '反枝苋',       -- Amaranthus retroflexus
  '北美苋',       -- Amaranthus blitoides
  '鬼针草',       -- Bidens pilosa
  '大狼耙草',     -- Bidens frondosa
  '刺苍耳',       -- Xanthium spinosum
  '野燕麦',       -- Avena fatua
  '阿拉伯婆婆纳', -- Veronica persica
  '北美车前',     -- Plantago virginica
  '北美独行菜',   -- Lepidium virginicum
  '匍匐大戟',     -- Euphorbia serpens
  '斑地锦草',     -- Euphorbia maculata
  '白苞猩猩草',   -- Euphorbia heterophylla
  '粗毛牛膝菊',   -- Galinsoga quadriradiata
  '圆叶牵牛',     -- Ipomoea purpurea
  '牵牛',         -- Ipomoea nil
  '小花山桃草',   -- Gaura parviflora
  '山桃草',       -- Gaura lindheimeri
  '紫穗槐',       -- Amorpha fruticosa
  '黄花酢浆草',   -- Oxalis pes-caprae
  '梣叶槭',       -- Acer negundo
  '香丝草',       -- Conyza bonariensis
  '苍耳'          -- Xanthium strumarium
);

-- 新增外来种中的10种入侵种
UPDATE plants SET is_invasive = true WHERE name_cn IN (
  '白车轴草',     -- Trifolium repens
  '白花草木樨',   -- Melilotus albus
  '草木樨',       -- Melilotus officinalis
  '刺槐',         -- Robinia pseudoacacia
  '南苜蓿',       -- Medicago polymorpha
  '天蓝苜蓿',     -- Medicago lupulina
  '小苜蓿',       -- Medicago minima
  '苦苣菜',       -- Sonchus oleraceus
  '续断菊',       -- Sonchus asper
  '野莴苣'        -- Lactuca serriola
);

-- 验证统计
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN is_native = true THEN 1 END) as native,
  COUNT(CASE WHEN is_native = false THEN 1 END) as exotic,
  COUNT(CASE WHEN is_invasive = true THEN 1 END) as invasive
FROM plants;
