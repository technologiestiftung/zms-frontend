import { IconRefreshCw } from "@supabase/ui";
import { format } from "date-fns";
import { FC } from "react";
import { ProcessType, ServiceType } from "../clean-types";
import classNames from "../utils/classNames";
import { useStore } from "../utils/Store";
import { ActiveProcessActions } from "./ActiveProcessActions";
import { InactiveProcessActions } from "./InactiveProcessActions";

interface NextCallPropsType extends ProcessType {
	serviceType?: ServiceType | null;
}

export const NextCall: FC<NextCallPropsType> = ({
	serviceType,
	...nextProcess
}) => {
	const [processInProgress] = useStore((s) => s.processInProgress);
	const process = processInProgress || nextProcess;
	const { service_id, check_in_time, scheduled_time, score } = process;
	const inProgress = !!processInProgress;

	const progressTitleText = classNames(
		`In Arbeit: Bitte person mit der ID ${service_id} im ZMS aufrufen`
	);
	const progressTitle = (
		<div className="flex gap-4 items-center">
			<span className="animate-pulse block w-[24px] h-[24px]">
				<IconRefreshCw size={24} strokeWidth={2} className="animate-spin" />
			</span>
			<span>{progressTitleText}</span>
		</div>
	);
	const title = inProgress ? progressTitle : "Nächster Aufruf";
	return (
		<div
			className={classNames(
				"p-4 mt-4 mb-6 -ml-4 -mr-4 rounded",
				inProgress ? "bg-brand text-white" : "bg-gray-100"
			)}
		>
			<h1 className="text-2xl font-bold mb-2">{title}</h1>
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
					{inProgress ? (
						<ActiveProcessActions process={process} />
					) : (
						<InactiveProcessActions process={process} />
					)}
				</div>
			</div>
		</div>
	);
};
