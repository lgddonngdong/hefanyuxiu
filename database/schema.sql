-- 黄河流域（河南段）自生植物数据库 - Supabase Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Plants table
CREATE TABLE IF NOT EXISTS plants (
    id SERIAL PRIMARY KEY,
    name_cn VARCHAR(100) NOT NULL,
    name_latin VARCHAR(200) NOT NULL,
    family VARCHAR(100) NOT NULL,
    genus VARCHAR(100) NOT NULL,
    image_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    wikipedia_url TEXT DEFAULT '',
    is_native BOOLEAN DEFAULT true,
    life_form VARCHAR(50) DEFAULT '草本',
    habitat VARCHAR(100) DEFAULT '',
    location VARCHAR(200) DEFAULT '',
    survey_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plants_name_cn ON plants(name_cn);
CREATE INDEX IF NOT EXISTS idx_plants_name_latin ON plants(name_latin);
CREATE INDEX IF NOT EXISTS idx_plants_family ON plants(family);
CREATE INDEX IF NOT EXISTS idx_plants_genus ON plants(genus);
CREATE INDEX IF NOT EXISTS idx_plants_is_native ON plants(is_native);
CREATE INDEX IF NOT EXISTS idx_plants_life_form ON plants(life_form);
CREATE INDEX IF NOT EXISTS idx_plants_created_at ON plants(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read
CREATE POLICY "Public can read plants" ON plants
    FOR SELECT USING (true);

-- Policy: anyone can insert (for demo purposes)
CREATE POLICY "Public can insert plants" ON plants
    FOR INSERT WITH CHECK (true);

-- Policy: anyone can update (for demo purposes)
CREATE POLICY "Public can update plants" ON plants
    FOR UPDATE USING (true);

-- Policy: anyone can delete (for demo purposes)
CREATE POLICY "Public can delete plants" ON plants
    FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plants_updated_at
    BEFORE UPDATE ON plants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
