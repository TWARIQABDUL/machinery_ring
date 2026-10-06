-- Admin-curated marketplace: equipment, spare parts and inputs the
-- cooperative sources or has arranged access to. No accounts, cart or
-- payment — same "browse, then inquire on WhatsApp" pattern as Services.
CREATE TABLE IF NOT EXISTS marketplace_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(40), -- 'equipment' | 'spare_parts' | 'inputs' | 'other'
    condition VARCHAR(20), -- 'new' | 'used'
    price NUMERIC(12,2),
    price_unit VARCHAR(50), -- e.g. 'per unit', 'per bag', left blank for a flat price
    image_path VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'in_stock', -- 'in_stock' | 'out_of_stock'
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inquiries submitted from a marketplace item's page.
CREATE TABLE IF NOT EXISTS marketplace_inquiries (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    district VARCHAR(120),
    sector VARCHAR(120),
    cell VARCHAR(120),
    village VARCHAR(120),
    item_id INTEGER REFERENCES marketplace_items(id) ON DELETE SET NULL,
    quantity VARCHAR(120),
    additional_info TEXT,
    consent_given_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled'
    whatsapp_sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
