-- Apply with:  cd server && npm run db:push
-- Or paste into Neon SQL Editor (Dashboard → SQL Editor).

CREATE TABLE IF NOT EXISTS analysis_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  candidate_name TEXT,
  linkedin_url TEXT,
  file_name TEXT,
  result JSONB,
  error TEXT
);

CREATE INDEX IF NOT EXISTS analysis_runs_created_at_idx ON analysis_runs (created_at DESC);
