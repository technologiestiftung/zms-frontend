import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error("Missing environment variables");
}

export const createUsersSupabaseClient = (userToken: string | undefined) => {
	return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		},
	});
};
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function supabaseSDKSignUp() {
	const email = faker.internet.email();
	const password = faker.internet.password();

	const user = await supabaseClient.auth.signUp({
		email,
		password,
	});
	return { user, email, password };
}

export async function supabaseSDKSignIn(email: string, password: string) {
	return await supabaseClient.auth.signInWithPassword({
		email,
		password,
	});
}

export async function supabaseSDKSignOut() {
	return await supabaseClient.auth.signOut();
}
