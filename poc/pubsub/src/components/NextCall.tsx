import { IconRefreshCw } from "@supabase/ui";
import { format } from "date-fns";
import { FC } from "react";
import { ProcessType, ServiceType } from "../clean-types";
import classNames from "../utils/classNames";
import { useStore } from "../utils/Store";
import { ProcessActions } from "./ProcessActions";

export const NextCall: FC<ProcessType> = ({ ...nextProcess }) => {
	const [processInProgress] = useStore((s) => s.processInProgress);
	const [serviceTypes] = useStore((s) => s.serviceTypes);
	const process = processInProgress || nextProcess;
	const { service_id, check_in_time, scheduled_time } = process;
	const inProgress = !!processInProgress;

	const processServiceTypes = process.service_types
		.map((s) => serviceTypes.find((serviceType) => serviceType.id === s.id))
		.filter(Boolean) as ServiceType[];

	const progressTitleText = classNames(
		`In Arbeit: Bitte person mit der ID ${service_id} im ZMS aufrufen`
	);
	const progressTitle = (
		<div className="flex gap-4 items-center">
			<span>{progressTitleText}</span>
			<span className="animate-pulse block w-[24px] h-[24px]">
				<IconRefreshCw size={24} strokeWidth={2} className="animate-spin" />
			</span>
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
			<div className="flex gap-6 justify-between flex-wrap">
				<div className="flex gap-8 text-sm">
					<span>
						<strong className="block">ZMS ID: </strong>
						{service_id}
					</span>
					{
						<span>
							<strong className="block">Checkin: </strong>
							{format(new Date(check_in_time), "HH:mm")}
						</span>
					}
					{scheduled_time && (
						<span>
							<strong className="block">Termin: </strong>
							{format(new Date(scheduled_time), "HH:mm")}
						</span>
					)}
					{processServiceTypes.length > 0 && (
						<span>
							<strong className="block">
								{processServiceTypes.length > 1
									? "Dienstleistungen"
									: "Dienstleistung"}
								:{" "}
							</strong>
							{processServiceTypes.map((s) => (
								<div className="truncate max-w-xs" key={s.id} title={s.name}>
									{s?.name}
								</div>
							))}
						</span>
					)}
				</div>
				<div className="flex gap-4 items-end">
					<ProcessActions process={process} />
				</div>
			</div>
		</div>
	);
};
