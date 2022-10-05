-- See https://supabase.com/docs/guides/realtime/postgres-changes
BEGIN;
-- remove the supabase_realtime publication
DROP publication IF EXISTS supabase_realtime;
-- re-create the supabase_realtime publication with no tables
CREATE publication supabase_realtime;
COMMIT;

-- add a table to the publication
ALTER publication supabase_realtime
	ADD TABLE processes;

ALTER TABLE processes REPLICA IDENTITY
	FULL;

