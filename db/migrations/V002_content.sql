-- Services offered by the cooperative (admin-managed, price shown publicly once set)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'available', -- 'available' | 'in_development'
    price NUMERIC(12,2),
    price_unit VARCHAR(50), -- e.g. 'per day', 'per hectare', 'per kg'
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Local Rings: just a name and a WhatsApp join invite link
CREATE TABLE IF NOT EXISTS rings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    whatsapp_invite_link TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Service requests submitted from the Contact page's "Request a service" form
CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    district VARCHAR(120),
    sector VARCHAR(120),
    cell VARCHAR(120),
    village VARCHAR(120),
    ring_id INTEGER REFERENCES rings(id) ON DELETE SET NULL,
    membership_status VARCHAR(20) NOT NULL DEFAULT 'unsure', -- 'member' | 'non_member' | 'unsure'
    service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
    crop VARCHAR(120),
    area_or_quantity VARCHAR(120),
    preferred_timing VARCHAR(255),
    additional_info TEXT,
    consent_given_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled'
    whatsapp_sent_at TIMESTAMP, -- set once the admin confirms the wa.me message was sent
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Gallery photos
CREATE TABLE IF NOT EXISTS gallery_items (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(500) NOT NULL,
    caption VARCHAR(500),
    category VARCHAR(80), -- 'equipment' | 'training' | 'field_days' | 'demonstration_farms'
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Blog posts / field updates
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt VARCHAR(500),
    body TEXT NOT NULL,
    cover_image_path VARCHAR(500),
    tag VARCHAR(80),
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft' | 'published'
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
