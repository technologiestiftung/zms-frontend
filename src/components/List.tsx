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
					<td className="align-top pb-3 pr-2">Vorgangsnummer</td>
					<td className="align-top pb-3 pr-2 leading-4">Checkin Uhrzeit</td>
					<td className="align-top pb-3 pr-2 leading-4">Termin Uhrzeit</td>
					<td className="align-top pb-3 pr-2">Dienstleistung(en)</td>
					<td className="align-top pb-3 pr-2">Notizen</td>
					{showDesk && <td className="align-top pb-3 pr-2">Platz</td>}
					<td className="align-top pb-3"></td>
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
