import { processes } from "./fixtures/processes";
import { tearDownDB } from "./utils/db";
import { createUsersSupabaseClient, supabaseSDKSignIn, supabaseSDKSignUp } from "./utils/supabase";

describe("processes table", () => {
	test("should allow to insert process without profile_id", async () => {
		await tearDownDB();

		const { user, email, password } = await supabaseSDKSignUp();
		await supabaseSDKSignIn(email, password);
		const usersClient = createUsersSupabaseClient(user.data.session?.access_token);
		const { data, error } = await usersClient.from("processes").insert(processes).select("*");
		if (error) {
			throw error;
		}
		if (!data) {
			throw new Error("no processes created");
		}

		expect(error).toBe(null);
		expect(data).toHaveLength(2);
		expect(data[0].profile_id).toBe(null);
		await tearDownDB();
	});
});
