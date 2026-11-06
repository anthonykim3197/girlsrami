CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  name TEXT NOT NULL CHECK(name IN ('page_view','product_detail_view','option_select','size_select','buy_cta_click','smartstore_outbound_click')),
  path TEXT NOT NULL,
  product_id TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT '',
  placement TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS analytics_session_created ON analytics_events(session_id,created_at);
