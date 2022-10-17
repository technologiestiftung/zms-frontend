import { FC } from "react";
import { Database } from "../db-types";
import { ListItem } from "./ListItem";
import { useServiceTypes } from "../utils/useServiceTypes";

type Process = Database["public"]["Tables"]["processes"]["Row"];
type ServiceType = Database["public"]["Tables"]["service_types"]["Row"];

interface ListPropsType {
	data: Process[];
	loading: boolean;
	serviceTypes: ServiceType[];
}

export const List: FC<ListPropsType> = ({ data, loading, serviceTypes }) => {
	return (
		<table className="w-full text-sm">
			<thead className="font-bold border-b">
				<tr>
					<td className="pb-3">ZMS ID</td>
					<td className="pb-3">Checkin</td>
					<td className="pb-3">Termin</td>
					<td className="pb-3">Dienstleistung</td>
					<td className="pb-3">Score</td>
					<td className="pb-3"></td>
				</tr>
			</thead>
			{!loading ? (
				<tbody>
					{data.map((item) => (
						<ListItem key={item.id} {...item} serviceTypes={serviceTypes} />
					))}
				</tbody>
			) : (
				<span>Lädt...</span>
			)}
		</table>
	);
};
