import { Auth, Button, Typography } from "@supabase/ui";
import { FC } from "react";
import { useStore } from "../utils/Store";
import { supabase } from "../utils/supabase";

export const Header: FC = () => {
	const { user } = Auth.useUser();
	const [profile] = useStore((s) => user?.id && s.profiles[user?.id]);
	return (
		<header className="flex justify-between flex-wrap gap-x-4 pb-2">
			<h1 className="font-bold text-2xl">Bürgeramt Checkin Pilot</h1>
			{user && (
				<div className="flex gap-4 items-center">
					{profile && <Typography.Text>{profile}</Typography.Text>}
					<Button size="medium" onClick={() => supabase.auth.signOut()}>
						Ausloggen
					</Button>
				</div>
			)}
		</header>
	);
};
