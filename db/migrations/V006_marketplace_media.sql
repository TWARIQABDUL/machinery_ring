-- Extra photos and a video per marketplace item. marketplace_items.image_path
-- stays in sync with whichever row here has is_primary = true, so the
-- listing grid and every place that already reads image_path keeps working
-- unchanged — this table is the source of truth for the item's full gallery.
CREATE TABLE IF NOT EXISTS marketplace_item_media (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL DEFAULT 'image', -- 'image' | 'video'
    media_path VARCHAR(500) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS marketplace_item_media_item_id_idx ON marketplace_item_media (item_id);
