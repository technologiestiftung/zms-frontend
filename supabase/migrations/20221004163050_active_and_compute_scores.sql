ALTER TABLE "public"."processes"
	ADD COLUMN "active" boolean NOT NULL DEFAULT TRUE;

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.compute_scores ()
	RETURNS void
	LANGUAGE plpgsql
	AS $function$
BEGIN
	UPDATE
		public.processes
	SET
		score = EXTRACT(EPOCH FROM (scheduled_time - check_in_time)) / 60
	WHERE
		active = TRUE;
END;
$function$;

