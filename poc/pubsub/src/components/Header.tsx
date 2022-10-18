import { Auth, Button, Typography } from "@supabase/ui";
import { FC } from "react";
import { supabase } from "../utils/supabase";

export const Header: FC = () => {
	const { user } = Auth.useUser();
	return (
		<header className="flex justify-between flex-wrap gap-x-4 pb-2">
			<h1 className="font-bold text-2xl">Bürgeramt Checkin Pilot</h1>
			{user && (
				<div className="flex gap-4 items-center">
					<Typography.Text>{user.email}</Typography.Text>
					<Button size="medium" onClick={() => supabase.auth.signOut()}>
						Sign out
					</Button>
				</div>
			)}
		</header>
	);
};
