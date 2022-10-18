import postgres from "postgres";

export async function tearDown() {
	const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
	if (!SUPABASE_DATABASE_URL) {
		throw new Error("Missing environment variables");
	}
	const sql = postgres(SUPABASE_DATABASE_URL);
	await sql`TRUNCATE TABLE auth.users CASCADE`;
	await sql`TRUNCATE TABLE public.processes CASCADE`;
	// we need to delete the profiles table as well because
	// somehow in the tests the table does not cascade delete
	// if done manually it does
	await sql`TRUNCATE TABLE public.profiles CASCADE`;
	await sql.end();
}
