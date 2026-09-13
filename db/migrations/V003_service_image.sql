-- Optional photo for a service, shown on the public Services page's slider.
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_path VARCHAR(500);
