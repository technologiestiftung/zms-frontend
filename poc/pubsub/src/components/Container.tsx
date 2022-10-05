import React, { useEffect, useState } from "react";
import { Auth, Typography, Button, Alert } from "@supabase/ui";
import { SupabaseClient } from "@supabase/supabase-js";
import { Process, supabase } from "../App";
import { List } from "./List";

interface ContainerProps {
	supabaseClient: SupabaseClient;
	children: JSX.Element | JSX.Element[];
}
export const Container = ({
	supabaseClient,
	children,
}: ContainerProps): JSX.Element => {
	const [change, setChange] = useState<number>(0);
	const [data, setData] = useState<Process[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { user } = Auth.useUser();
	const sub = supabaseClient
		.from("processes")
		.on("*", (payload) => {
			console.info("change detected!", payload);
			setChange((prev) => prev + 1);
		})
		.subscribe();
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
				throw error;
			}
			// console.info(processes);
			setData(processes);
			setLoading(false);
		};
		fetch().catch(console.error);
	}, [user, change]);

	// useEffect(() => {
	// 	if (!user) return;
	// }, [user]);

	if (user)
		return (
			<>
				<div>
					<Alert title="Change Detected">
						<Typography.Text> Number of changes: {change}</Typography.Text>
					</Alert>
				</div>
				<List data={data} loading={loading} />
				<Typography.Text>Signed in: {user.email}</Typography.Text>
				<Button block onClick={() => supabaseClient.auth.signOut()}>
					Sign out
				</Button>
			</>
		);
	return Array.isArray(children) ? ((<>children</>) as JSX.Element) : children;
};
