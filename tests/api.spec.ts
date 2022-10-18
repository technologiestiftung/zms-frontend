import { tearDown } from "./utils/db";
import {
	createUsersSupabaseClient,
	supabaseClient,
	supabaseSDKSignIn,
	supabaseSDKSignUp,
} from "./utils/supabase";

const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs";
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error("Missing environment variables");
}

describe("Supabase API", () => {
	test("should get open api response from supabase api ", async () => {
		const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
			method: "GET",
			headers: {
				apikey: SUPABASE_ANON_KEY,
			},
		});
		expect(response.status).toBe(200);
	});

	test("should get response from supabase api using client SDK ", async () => {
		const { user, email, password } = await supabaseSDKSignUp();
		await supabaseSDKSignIn(email, password);
		const usersClient = createUsersSupabaseClient(user.data.session?.access_token);
		const { data, error } = await usersClient.from("profiles").select("*");
		expect(error).toBe(null);
		expect(data).toHaveLength(1);
		await tearDown();
	});
});
