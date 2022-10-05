import { Typography } from "@supabase/ui";

interface ListItemProps {
	service_id: string | number;
	score: number | null;
}
export const ListItem = ({ service_id, score }: ListItemProps): JSX.Element => {
	return (
		<li>
			<span style={{ paddingRight: "10px" }}>
				Service ID: <Typography.Text>{service_id}</Typography.Text>
			</span>{" "}
			<span>{"\t\t"}</span>
			{score ? (
				<>
					Score: <Typography.Text>{score}</Typography.Text>
				</>
			) : null}
		</li>
	);
};
