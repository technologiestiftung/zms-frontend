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

CREATE OR REPLACE FUNCTION public.set_process_score ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $$
BEGIN
	UPDATE
		public.processes p
	SET
		score = EXTRACT(EPOCH FROM (NEW.scheduled_time - NEW.check_in_time))::integer / 60
	WHERE
		NEW.id = p.id;
	RETURN NEW;
END;
$$;

CREATE TRIGGER on_process_create_compute_score
	AFTER INSERT ON public.processes
	FOR EACH ROW
	EXECUTE PROCEDURE public.set_process_score ();

ALTER TABLE public.processes
	ALTER COLUMN scheduled_time SET NOT NULL;

