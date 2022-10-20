import { FC } from "react";
import { ProcessType } from "../clean-types";
import { useStore } from "../utils/Store";
import { ListItem } from "./ListItem";

export const List: FC<{
	processes: ProcessType[];
	showDesk?: boolean;
}> = ({ processes, showDesk = true }) => {
	const [processesLoading] = useStore((s) => s.processesLoading);
	return (
		<table className="w-full text-sm">
			<thead className="font-bold border-b">
				<tr>
					<td className="pb-3">ZMS ID</td>
					<td className="pb-3">Checkin</td>
					<td className="pb-3">Termin</td>
					<td className="pb-3">Dienstleistung(en)</td>
					<td className="pb-3">Notizen</td>
					{showDesk && <td className="pb-3">Platz</td>}
					<td className="pb-3"></td>
				</tr>
			</thead>
			<tbody>
				{!processesLoading ? (
					processes.map((process) => (
						<ListItem key={process.id} showDesk={showDesk} {...process} />
					))
				) : (
					<tr>
						<td colSpan={6}>Lädt...</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};
