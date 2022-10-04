-- based on https://learnsql.com/cookbook/how-to-calculate-the-difference-between-two-timestamps-in-postgresql/
SELECT
	EXTRACT(EPOCH FROM (scheduled_time - check_in_time)) / 60 AS minutes
FROM
	processes;

CREATE OR REPLACE FUNCTION public.compute_scores ()
	RETURNS void
	AS $$
BEGIN
	UPDATE
		public.processes
	SET
		score = EXTRACT(EPOCH FROM (scheduled_time - check_in_time)) / 60
	WHERE
		active = TRUE;
END;
$$
LANGUAGE plpgsql;

-- SELECT
SELECT
	public.compute_scores ();

