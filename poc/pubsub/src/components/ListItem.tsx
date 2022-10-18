import { FC, HTMLProps } from "react";
import { format } from "date-fns";
import { InactiveProcessActions } from "./InactiveProcessActions";
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
	const { service_id, scheduled_time, check_in_time, service_type_id } =
		process;
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
			<Td className="w-96">
				<div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<InactiveProcessActions process={process} />
				</div>
			</Td>
		</tr>
	);
};
