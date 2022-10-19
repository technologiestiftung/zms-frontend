import { Process, processes } from "./fixtures/processes";
import { tearDownDB } from "./utils/db";
import { createUsersSupabaseClient, supabaseSDKSignIn, supabaseSDKSignUp } from "./utils/supabase";

describe("relations table", () => {
	test("should get relations with text", async () => {
		await tearDownDB();
		// await setupDB();

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
		await usersClient.rpc("add_service_types_to_process", {
			pid: p_data[0].id,
			service_type_ids: [1, 2, 3],
		});
		const { data, error } = await usersClient
			.from("processes")
			.select(
				`
			id, service_id,
			service_types(id, text)
			`,
			)
			.eq("id", p_data[0].id);
		if (!data) {
			throw new Error("no data");
		}

		expect(error).toBe(null);
		expect(data).toHaveLength(1);
		expect(data[0].service_types).toHaveLength(3);
		await tearDownDB();
	});
});
