import { processes } from "./fixtures/processes";
import { setupDB, tearDownDB } from "./utils/db";
import {
	createUsersSupabaseClient,
	supabaseClient,
	supabaseSDKSignIn,
	supabaseSDKSignOut,
	supabaseSDKSignUp,
} from "./utils/supabase";

describe("remote procedure calls", () => {
	test("Anon user should not be allowed to use the rpc", async () => {
		await setupDB();
		const { user, email, password } = await supabaseSDKSignUp();
		await supabaseSDKSignIn(email, password);
		const usersClient = createUsersSupabaseClient(user.data.session?.access_token);
		const { data: p_data, error: p_erorr } = await usersClient
			.from("processes")
			.insert(processes)
			.select("*");
		if (p_erorr) {
			throw p_erorr;
		}
		if (!p_data) {
			throw new Error("no processes created");
		}

		const { data, error } = await supabaseClient.rpc("add_service_types_to_process", {
			pid: p_data[0].id,
			service_type_ids: [1, 2, 3],
		});
		expect(data).toBe(null);
		expect(error).not.toBe(null);

		await tearDownDB();
	});
});
