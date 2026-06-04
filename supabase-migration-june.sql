-- Add challenge column to workouts table
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS challenge TEXT DEFAULT 'may-2026';

-- Backfill existing May data
UPDATE workouts SET challenge = 'may-2026' WHERE challenge IS NULL;

-- Update default for new rows going forward
ALTER TABLE workouts ALTER COLUMN challenge SET DEFAULT 'june-2026';
