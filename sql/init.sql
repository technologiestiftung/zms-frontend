DROP TABLE IF EXISTS "public"."profiles";

-- DROP INDEX IF EXISTS user_name_case_insensitive;
CREATE TABLE "public"."profiles" (
	"id" uuid NOT NULL,
	"description" text,
	PRIMARY KEY ("id")
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for authenticated users only" ON "public"."profiles" AS PERMISSIVE
	FOR SELECT TO authenticated
		USING (TRUE);

CREATE POLICY "Users can insert their own profile." ON profiles
	FOR INSERT
		WITH CHECK (auth.uid () = id);

CREATE POLICY "Users can update own profile." ON profiles
	FOR UPDATE
		USING (auth.uid () = id);

-- https://supabase.com/docs/guides/auth/managing-user-data#advanced-techniques
-- inserts a row into public.users
CREATE FUNCTION public.handle_new_user ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path = public
	AS $$
BEGIN
	INSERT INTO public.profiles (id)
		VALUES (NEW.id);
	RETURN new;
END;
$$;

-- trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW
	EXECUTE PROCEDURE public.handle_new_user ();

CREATE TABLE service_types (
	id int GENERATED BY DEFAULT AS IDENTITY,
	name text,
	PRIMARY KEY ("id")
);

ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for authenticated users only" ON "public"."service_types" AS PERMISSIVE
	FOR SELECT TO authenticated
		USING (TRUE);

DROP TABLE IF EXISTS "public".process;

-- add the process
CREATE TABLE public.processes (
	id int GENERATED BY DEFAULT AS IDENTITY,
	service_id int NOT NULL,
	scheduled_time timestamp with time zone,
	start_time timestamp with time zone,
	end_time timestamp with time zone,
	notes text,
	score real,
	service_type_id int REFERENCES service_types (id) ON DELETE SET NULL
);

ALTER TABLE processes
	ADD PRIMARY KEY (id);

-- ---------
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for authenticated users only" ON "public"."processes" AS PERMISSIVE
	FOR SELECT TO authenticated
		USING (TRUE);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."processes" AS PERMISSIVE
	FOR INSERT TO authenticated
		WITH CHECK (TRUE);

CREATE POLICY "Enable update for authenticated users only" ON "public"."processes" AS PERMISSIVE
	FOR UPDATE TO authenticated
		WITH CHECK (TRUE);

ALTER TABLE "public"."processes"
	ADD COLUMN "check_in_time" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "public"."processes"
	ADD COLUMN "active" boolean NOT NULL DEFAULT TRUE;

ALTER TABLE public.service_types RENAME COLUMN name TO "text";

-- add id and text constraint to public.service_types
ALTER TABLE public.service_types
	ALTER COLUMN "text" SET NOT NULL;

ALTER TABLE public.service_types
	ADD UNIQUE ("text", id);

ALTER TABLE public.service_types
	ADD UNIQUE ("text");

ALTER TABLE public.processes
	DROP COLUMN IF EXISTS service_type_id;

