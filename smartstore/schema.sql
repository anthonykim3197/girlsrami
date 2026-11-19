CREATE TABLE IF NOT EXISTS smartstore_daily_summary (
  day TEXT PRIMARY KEY,
  collected_at TEXT NOT NULL,
  snapshot TEXT NOT NULL CHECK(json_valid(snapshot))
);
