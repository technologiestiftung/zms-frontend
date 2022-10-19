alter table "public"."process_service_types" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_service_types_to_process(pid integer, service_type_ids integer[])
 RETURNS TABLE(process_id integer, service_type_id integer)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

create policy "Enable delete for authenticated users only"
on "public"."process_service_types"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."process_service_types"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."process_service_types"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."process_service_types"
as permissive
for update
to authenticated
using (true)
with check (true);



