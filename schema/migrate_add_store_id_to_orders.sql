-- Migration: Add store_id to orders for per-store isolation
-- Run this SQL in Supabase (SQL Editor) before deploying the backend changes.

-- 1) Add store_id column if missing
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES store_templates(id);

-- 2) Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);

-- 3) (Optional) Tighten RLS to ensure only the store owner can see their orders
-- Adjust or replace existing policies as needed:
--   - You may already have broader policies; update them to include store_id checks.
-- Example policies:
-- CREATE POLICY "Sellers view own orders"
--   ON orders FOR SELECT TO authenticated
--   USING (
--     store_id IN (
--       SELECT id FROM store_templates WHERE user_id = auth.uid()
--     )
--   );
--
-- CREATE POLICY "Sellers manage own orders"
--   ON orders FOR INSERT TO authenticated
--   WITH CHECK (
--     store_id IN (
--       SELECT id FROM store_templates WHERE user_id = auth.uid()
--     )
--   );
--
-- CREATE POLICY "Sellers update own orders"
--   ON orders FOR UPDATE TO authenticated
--   USING (
--     store_id IN (
--       SELECT id FROM store_templates WHERE user_id = auth.uid()
--     )
--   );
--
-- CREATE POLICY "Sellers delete own orders"
--   ON orders FOR DELETE TO authenticated
--   USING (
--     store_id IN (
--       SELECT id FROM store_templates WHERE user_id = auth.uid()
--     )
--   );

