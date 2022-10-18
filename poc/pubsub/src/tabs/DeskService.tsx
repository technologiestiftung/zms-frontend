import { RealtimeSubscription } from "@supabase/supabase-js";
import { Alert, Auth, Typography } from "@supabase/ui";
import { FC, useCallback, useEffect, useState } from "react";
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

	const updateList = useCallback(async () => {
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
	}, []);

	useEffect(() => {
		let subscription: RealtimeSubscription | null = null;
		const sub = async () => {
			subscription = supabase
				.from("processes")
				.on("*", (payload) => {
					console.info("change detected!", payload);
					setChange((prev) => prev + 1);
				})
				.subscribe();
			void updateList();
		};
		sub();
		return () => subscription?.unsubscribe();
	}, [updateList]);

	useEffect(() => {
		if (!user) return;
		updateList();
		setLoading(false);
	}, [user, change, updateList]);

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
