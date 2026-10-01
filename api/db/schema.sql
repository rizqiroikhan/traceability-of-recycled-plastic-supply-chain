CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT NOT NULL UNIQUE,
  material_type TEXT NOT NULL CHECK (material_type IN ('PET', 'HDPE', 'PP')),
  weight_kg NUMERIC(12, 2) NOT NULL CHECK (weight_kg > 0),
  source_location TEXT NOT NULL CHECK (length(trim(source_location)) > 0),
  processed_at DATE,
  current_status TEXT NOT NULL DEFAULT 'Collected' CHECK (current_status IN ('Collected', 'Processing', 'Ready', 'Delivered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL CHECK (length(trim(event_type)) > 0),
  event_date DATE NOT NULL,
  location TEXT NOT NULL CHECK (length(trim(location)) > 0),
  actor TEXT NOT NULL CHECK (length(trim(actor)) > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(current_status);
CREATE INDEX IF NOT EXISTS idx_batches_material ON batches(material_type);
CREATE INDEX IF NOT EXISTS idx_batch_events_timeline ON batch_events(batch_id, event_date, created_at);
