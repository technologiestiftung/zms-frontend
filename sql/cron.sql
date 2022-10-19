DROP EXTENSION "pg_cron";

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions" version '1.4';

GRANT usage ON SCHEMA cron TO postgres;

GRANT ALL privileges ON ALL tables IN SCHEMA cron TO postgres;

SELECT
	cron.schedule ('update processes scores every minute', '* * * * *', $$
		SELECT
			public.compute_scores () $$);

SELECT
	*
FROM
	cron.job;

