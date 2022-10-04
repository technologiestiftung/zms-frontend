CREATE EXTENSION pg_cron;

SELECT
	cron.schedule ('update processes scores every minute', '* * * * *', $$
		SELECT
			public.compute_scores () $$);

SELECT
	*
FROM
	cron.job;

SELECT
	*
FROM
	cron.job_run_details;

SELECT
	cron.unschedule ('update processes scores every minute');

-- pass the name of the cron job
