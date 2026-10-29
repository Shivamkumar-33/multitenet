-- ============================================================
-- FIX 1: Enable Row Level Security (RLS) on all public tables
-- ============================================================
-- Since this app uses Prisma (connecting as the `postgres` role),
-- we enable RLS and grant the postgres role full access.
-- The `anon` and `authenticated` Supabase roles are denied by
-- default (no policy = deny), protecting against direct API abuse.
-- ============================================================

-- organizations
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organizations" FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow postgres full access on organizations"
  ON "organizations"
  FOR ALL
  TO postgres
  USING (true)
  WITH CHECK (true);

-- organization_members
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_members" FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow postgres full access on organization_members"
  ON "organization_members"
  FOR ALL
  TO postgres
  USING (true)
  WITH CHECK (true);

-- users
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow postgres full access on users"
  ON "users"
  FOR ALL
  TO postgres
  USING (true)
  WITH CHECK (true);

-- documents
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow postgres full access on documents"
  ON "documents"
  FOR ALL
  TO postgres
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- FIX 2: Add indexes on unindexed foreign keys
-- ============================================================
-- documents.organizationId -> organizations.id
CREATE INDEX IF NOT EXISTS "documents_organizationId_idx"
  ON "documents" ("organizationId");

-- documents.userId -> users.id
CREATE INDEX IF NOT EXISTS "documents_userId_idx"
  ON "documents" ("userId");

-- organization_members.organizationId -> organizations.id
-- (Note: the @@unique([organizationId, userId]) already covers
--  queries filtering by organizationId first, but an explicit
--  single-column index on organizationId is still useful for
--  queries that only join/filter on organizationId alone.)
CREATE INDEX IF NOT EXISTS "organization_members_organizationId_idx"
  ON "organization_members" ("organizationId");

-- organization_members.userId -> users.id
CREATE INDEX IF NOT EXISTS "organization_members_userId_idx"
  ON "organization_members" ("userId");
