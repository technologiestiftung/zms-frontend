SELECT
	relname,
	relrowsecurity,
	relforcerowsecurity
FROM
	pg_class
WHERE
	oid = 'profiles'::regclass;

-- show all row level security on table profiles
SELECT
	*
FROM
	pg_policies
WHERE
	tablename = 'profiles';

-- the policy below is needed to allow update calls, since the user not only needs to do a update but also a select
CREATE POLICY "Enable update for authenticated users only with select" ON "public"."processes" AS permissive
	FOR UPDATE TO authenticated
		WITH CHECK (TRUE)
		USING (TRUE);

