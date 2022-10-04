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

