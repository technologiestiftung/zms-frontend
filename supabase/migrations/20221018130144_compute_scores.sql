ALTER TABLE "public"."processes"
	ALTER COLUMN "scheduled_time" SET NOT NULL;

SET check_function_bodies = OFF;

	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER AS $function$
BEGIN
	UPDATE
		public.processes p
	SET
		score = EXTRACT(EPOCH FROM (NEW.scheduled_time - NEW.check_in_time))::integer / 60
	WHERE
		NEW.id = p.id;

RETURN NEW;

END;

$function$;

CREATE OR REPLACE FUNCTION public.compute_scores ()
	RETURNS void
	LANGUAGE plpgsql
	AS $function$
BEGIN
	UPDATE
		public.processes
	SET
		score = EXTRACT(EPOCH FROM (scheduled_time - check_in_time))::integer / 60
	WHERE
		active = TRUE;
END;
$function$;

CREATE TRIGGER on_process_create_compute_score
	AFTER INSERT ON public.processes
	FOR EACH ROW
	EXECUTE FUNCTION set_process_score ();

