-- Tabelle für Kontaktanfragen erstellen
CREATE TABLE IF NOT EXISTS contact_requests (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Index für bessere Performance bei Abfragen
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email);

