import { FC, HTMLProps } from "react";
import { format } from "date-fns";
import { ProcessActions } from "./ProcessActions";
import { ProcessType } from "../clean-types";
import { useStore } from "../utils/Store";

const Td: FC<HTMLProps<HTMLTableCellElement>> = ({ children, className }) => (
	<td
		className={[
			className,
			"py-1 group-first-of-type:pt-3 group-first-of-type:pb-1",
			"group-even:bg-gray-50 w-1/6 pr-2",
		]
			.filter(Boolean)
			.join(" ")}
	>
		{children}
	</td>
);

export const ListItem: FC<ProcessType> = ({ ...process }) => {
	const [serviceTypes] = useStore((s) => s.serviceTypes);
	const { service_id, scheduled_time, check_in_time, service_types } = process;
	const processServiceTypes = service_types
		.map(
			(s) => serviceTypes.find((serviceType) => serviceType.id === s.id)?.name
		)
		.filter(Boolean)
		.join(", ");
	return (
		<tr className="group">
			<Td>{service_id}</Td>
			<Td>{check_in_time ? format(new Date(check_in_time), "HH:mm") : ""}</Td>
			<Td>{scheduled_time ? format(new Date(scheduled_time), "HH:mm") : ""}</Td>
			<Td>
				<span
					className="truncate max-w-xs inline-block"
					title={processServiceTypes}
				>
					{processServiceTypes}
				</span>
			</Td>
			<Td className="w-96">
				<div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 justify-end">
					<ProcessActions process={process} />
				</div>
			</Td>
		</tr>
	);
};
