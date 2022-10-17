import { FC, HTMLProps } from "react";
import { Database } from "../db-types";
import { format } from "date-fns";
import { ProcessActions } from "./ProcessActions";

type Process = Database["public"]["Tables"]["processes"]["Row"];
type ServiceType = Database["public"]["Tables"]["service_types"]["Row"];

export const Td: FC<HTMLProps<HTMLTableCellElement>> = ({
	children,
	className,
}) => (
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

interface ListItemPropsType extends Process {
	serviceTypes: ServiceType[];
}

export const ListItem: FC<ListItemPropsType> = ({
	id,
	serviceTypes,
	service_id,
	scheduled_time,
	check_in_time,
	service_type_id,
	score,
}) => {
	const serviceType = serviceTypes.find(
		(serviceType) => serviceType.id === service_type_id
	);
	return (
		<tr className="group">
			<Td>{service_id}</Td>
			<Td>{check_in_time ? format(new Date(check_in_time), "HH:mm") : ""}</Td>
			<Td>{scheduled_time ? format(new Date(scheduled_time), "HH:mm") : ""}</Td>
			<Td>
				<span
					className="truncate max-w-xs inline-block"
					title={serviceType?.name || ""}
				>
					{serviceType?.name}
				</span>
			</Td>
			<Td>{score}</Td>
			<Td className="w-96">
				<div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<ProcessActions rowId={id} />
				</div>
			</Td>
		</tr>
	);
};
