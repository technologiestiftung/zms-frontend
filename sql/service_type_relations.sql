CREATE TABLE public.process_service_types (
	process_id int4 REFERENCES public.processes (id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	service_type_id int4 REFERENCES public.service_types (id) ON UPDATE CASCADE NOT NULL,
	CONSTRAINT process_service_type_pkey PRIMARY KEY (process_id, service_type_id)
);

DROP FUNCTION IF EXISTS public.add_service_types_to_process (integer, integer[]);

CREATE OR REPLACE FUNCTION add_service_types_to_process (pid int, service_type_ids int[])
	RETURNS TABLE (
		process_id int,
		service_type_id int)
	SECURITY INVOKER
	LANGUAGE plpgsql
	AS $$
DECLARE
	service_type_id int;
BEGIN
	DELETE FROM public.process_service_types p
	WHERE p.process_id = pid;
	foreach service_type_id IN ARRAY service_type_ids LOOP
		INSERT INTO public.process_service_types (process_id, service_type_id)
			VALUES (pid, service_type_id)
		ON CONFLICT ON CONSTRAINT process_service_type_pkey
			DO NOTHING;
	END LOOP;
	RETURN QUERY
	SELECT
		ppst.process_id,
		ppst.service_type_id
	FROM
		public.process_service_types ppst
	WHERE
		ppst.process_id = pid;
END;
$$;

