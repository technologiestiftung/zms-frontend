DROP POLICY "Enable read for authenticated users only" ON "public"."profiles";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.delete_user ()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	SECURITY DEFINER
	AS $function$
DECLARE
	row_count int;
BEGIN
	DELETE FROM public.profiles p
	WHERE p.id = OLD.id;
	IF found THEN
		GET DIAGNOSTICS row_count = ROW_COUNT;
		RAISE NOTICE 'DELETEd % row(s) FROM profiles', row_count;
	END IF;
	RETURN OLD;
END;
$function$;

CREATE OR REPLACE TRIGGER on_auth_user_delete BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.delete_user ();

CREATE POLICY "Enable select for users based on id" ON "public"."profiles" AS permissive
	FOR SELECT TO public
		USING ((auth.uid () = id));

