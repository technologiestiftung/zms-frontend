import { ListItem } from "./ListItem";
import { Process } from "../App";

export const List: React.FC<{ data: Process[]; loading: boolean }> = ({
	data,
	loading,
}) => {
	return (
		<ul>
			{!loading ? (
				data.map((item) => (
					<ListItem
						key={item.id}
						service_id={item.service_id}
						score={item.score}
					/>
				))
			) : (
				<ListItem service_id={"Loading"} score={null} />
			)}
		</ul>
	);
};
