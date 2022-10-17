import { Alert, Auth, Typography } from "@supabase/ui";
import { FC, useEffect, useState } from "react";
import { List } from "../components/List";
import { Database } from "../db-types";
import { supabase } from "../utils/supabase";

type Process = Database["public"]["Tables"]["processes"]["Row"];

export const DeskService: FC = () => {
	const [change, setChange] = useState<number>(0);
	const [data, setData] = useState<Process[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const { user } = Auth.useUser();

	useEffect(() => {
		supabase
			.from("processes")
			.on("*", (payload) => {
				console.info("change detected!", payload);
				setChange((prev) => prev + 1);
			})
			.subscribe();
	}, []);

	useEffect(() => {
		if (!user) return;
		const fetch = async () => {
			setLoading(true);
			const { data: processes, error } = await supabase
				.from<Process>("processes")
				.select("*")
				.filter("active", "eq", true);

			if (error) {
				console.error(error);
				setError(error.message);
				return;
			}

			setData(processes);
			setLoading(false);
		};
		fetch().catch(console.error);
	}, [user, change]);

	if (!user) return null;
	return (
		<>
			{error && (
				<div className="mb-4">
					<Alert variant="danger" title="Es ist ein Fehler aufgetreten">
						<Typography.Text>{error}</Typography.Text>
					</Alert>
				</div>
			)}
			<List data={data} loading={loading} />
		</>
	);
};
