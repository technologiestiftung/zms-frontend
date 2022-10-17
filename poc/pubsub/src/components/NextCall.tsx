import { format } from "date-fns";
import { FC } from "react";
import { Database } from "../db-types";
import { ProcessActions } from "./ProcessActions";

type Process = Database["public"]["Tables"]["processes"]["Row"];
type ServiceType = Database["public"]["Tables"]["service_types"]["Row"];

interface NextCallPropsType extends Process {
	serviceType?: ServiceType | null;
}

export const NextCall: FC<NextCallPropsType> = ({
	serviceType,
	service_id,
	id,
	check_in_time,
	scheduled_time,
	score,
}) => {
	return (
		<div className="p-4 mt-4 mb-6 -ml-4 -mr-4 rounded bg-gray-100">
			<h1 className="text-2xl font-bold mb-2">Nächster Aufruf</h1>
			<div className="flex gap-6 justify-between">
				<div className="flex gap-8 text-sm items-center">
					<span>
						<strong>ZMS ID: </strong>
						{service_id}
					</span>
					{serviceType?.name && (
						<span>
							<strong>Dienstleistung: </strong>
							{serviceType?.name}
						</span>
					)}
					{
						<span>
							<strong>Checkin: </strong>
							{format(new Date(check_in_time), "HH:mm")}
						</span>
					}
					{scheduled_time && (
						<span>
							<strong>Termin: </strong>
							{format(new Date(scheduled_time), "HH:mm")}
						</span>
					)}
					{score && (
						<span>
							<strong>Score: </strong>
							{score}
						</span>
					)}
				</div>
				<div className="flex gap-4 float-right">
					<ProcessActions rowId={id} />
				</div>
			</div>
		</div>
	);
};
