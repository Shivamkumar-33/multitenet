SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('organizations', 'organization_members', 'users', 'documents');
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE '%_idx';
