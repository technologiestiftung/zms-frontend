-- drop policy "Enable delete for authenticated users only" on "public"."processes";
-- drop policy "Enable update for authenticated users only with select" on "public"."processes";
-- drop policy "Enable insert for authenticated users only" on "public"."service_types";
-- alter table "public"."processes" drop constraint "processes_service_type_id_fkey";
CREATE TABLE "public"."process_service_types" (
	"process_id" integer NOT NULL,
	"service_type_id" integer NOT NULL
);

ALTER TABLE "public"."processes"
	DROP COLUMN "service_type_id";

ALTER TABLE "public"."service_types"
	DROP COLUMN "name";

ALTER TABLE "public"."service_types"
	ADD COLUMN "text" text NOT NULL;

CREATE UNIQUE INDEX process_service_type_pkey ON public.process_service_types USING btree (process_id, service_type_id);

CREATE UNIQUE INDEX service_types_text_id_key ON public.service_types USING btree (text, id);

CREATE UNIQUE INDEX service_types_text_key ON public.service_types USING btree (text);

ALTER TABLE "public"."process_service_types"
	ADD CONSTRAINT "process_service_type_pkey" PRIMARY KEY USING INDEX "process_service_type_pkey";

ALTER TABLE "public"."process_service_types"
	ADD CONSTRAINT "process_service_types_process_id_fkey" FOREIGN KEY (process_id) REFERENCES processes (id) ON UPDATE CASCADE ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."process_service_types" validate CONSTRAINT "process_service_types_process_id_fkey";

ALTER TABLE "public"."process_service_types"
	ADD CONSTRAINT "process_service_types_service_type_id_fkey" FOREIGN KEY (service_type_id) REFERENCES service_types (id) ON UPDATE CASCADE NOT valid;

ALTER TABLE "public"."process_service_types" validate CONSTRAINT "process_service_types_service_type_id_fkey";

ALTER TABLE "public"."service_types"
	ADD CONSTRAINT "service_types_text_id_key" UNIQUE USING INDEX "service_types_text_id_key";

ALTER TABLE "public"."service_types"
	ADD CONSTRAINT "service_types_text_key" UNIQUE USING INDEX "service_types_text_key";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.add_service_types_to_process (_process_id integer, service_type_ids integer[])
	RETURNS TABLE (
		process_id integer,
		service_type_id integer)
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
DECLARE
	service_type_id int;
BEGIN
	DELETE FROM public.process_service_types p
	WHERE p.process_id = _process_id;
	foreach service_type_id IN ARRAY service_type_ids LOOP
		INSERT INTO public.process_service_types (process_id, service_type_id)
			VALUES (_process_id, service_type_id)
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
		ppst.process_id = _process_id;
END;
$function$;

-- create policy "Enable update for authenticated users only"
-- on "public"."processes"
-- as permissive
-- for update
-- to authenticated
-- with check (true);
