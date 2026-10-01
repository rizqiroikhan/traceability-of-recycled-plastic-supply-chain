INSERT INTO batches (batch_code, material_type, weight_kg, source_location, processed_at, current_status)
VALUES
  ('RP-2026-001', 'PET', 1840.50, 'Bandung Collection Hub', '2026-01-18', 'Ready'),
  ('RP-2026-002', 'HDPE', 1265.00, 'Surabaya Coastal Recovery', '2026-02-03', 'Processing'),
  ('RP-2026-003', 'PP', 980.25, 'Jakarta Municipal Sorting', '2026-02-21', 'Delivered'),
  ('RP-2026-004', 'PET', 2110.75, 'Semarang Retail Return Center', NULL, 'Collected')
ON CONFLICT (batch_code) DO UPDATE SET material_type = EXCLUDED.material_type, weight_kg = EXCLUDED.weight_kg, source_location = EXCLUDED.source_location, processed_at = EXCLUDED.processed_at, current_status = EXCLUDED.current_status;

INSERT INTO batch_events (batch_id, event_type, event_date, location, actor, notes)
SELECT b.id, v.event_type, v.event_date::DATE, v.location, v.actor, v.notes
FROM batches b
JOIN (VALUES
  ('RP-2026-001', 'Collected', '2026-01-06', 'Bandung Collection Hub', 'West Java Cooperative', 'Sorted PET bottles received from neighborhood drop-off points.'),
  ('RP-2026-001', 'Washed', '2026-01-10', 'Bandung Wash Line', 'CleanLoop Processing', 'Labels and caps removed before flake processing.'),
  ('RP-2026-001', 'Processed', '2026-01-18', 'Bandung Pelletizing Plant', 'CleanLoop Processing', 'Recycled PET pellets passed quality inspection.'),
  ('RP-2026-002', 'Collected', '2026-01-24', 'Surabaya Coastal Recovery', 'BlueCoast Network', 'HDPE containers recovered and weighed.'),
  ('RP-2026-002', 'Processed', '2026-02-03', 'Surabaya Sorting Facility', 'BlueCoast Network', 'Material baled and prepared for reprocessing.'),
  ('RP-2026-003', 'Collected', '2026-02-05', 'Jakarta Municipal Sorting', 'Jakarta Circularity Unit', 'Post-consumer PP separated from mixed stream.'),
  ('RP-2026-003', 'Processed', '2026-02-15', 'Bekasi Reprocessing Plant', 'ReForm Materials', 'PP regrind compounded for final-use manufacturing.'),
  ('RP-2026-003', 'Delivered', '2026-02-21', 'Tangerang Manufacturing Site', 'ReForm Materials', 'Recycled PP delivered to the packaging production line.'),
  ('RP-2026-004', 'Collected', '2026-02-27', 'Semarang Retail Return Center', 'RetailLoop Indonesia', 'PET returns consolidated for the next processing run.')
) AS v(batch_code, event_type, event_date, location, actor, notes) ON v.batch_code = b.batch_code
WHERE NOT EXISTS (SELECT 1 FROM batch_events e WHERE e.batch_id = b.id AND e.event_type = v.event_type AND e.event_date = v.event_date::DATE AND e.location = v.location);
