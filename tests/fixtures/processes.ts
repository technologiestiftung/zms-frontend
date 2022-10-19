import { Database } from "../utils/types";
export type Process = Database["public"]["Tables"]["processes"]["Row"];
export const processes: Partial<Process>[] = [
	{
		service_id: 1,
		notes: "notes",
		check_in_time: "2021-01-01 00:00:00",
		scheduled_time: "2021-01-01 00:00:00",
	},
	{
		service_id: 1,
		score: 1,
		check_in_time: "2021-01-01 00:00:00",
		scheduled_time: "2021-01-01 00:00:00",
	},
];
