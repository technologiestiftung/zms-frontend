import { Alert, Auth, Typography } from "@supabase/ui";
import { FC } from "react";
import { List } from "../components/List";
import { NextCall } from "../components/NextCall";
import { useStore } from "../utils/Store";

export const DeskService: FC = () => {
	const [processInProgress] = useStore((s) => s.processInProgress);
	const [serviceTypes] = useStore((s) => s.serviceTypes);
	const [processes] = useStore((s) => s.processes);
	const [processesError] = useStore((s) => s.processesError);
	const inProgress = !!processInProgress;
	const { user } = Auth.useUser();

	if (!user) return null;

	const nextProcesses = processes.filter((p) => !p.start_time && !p.end_time);
	const [firstItem, ...restData] = nextProcesses;
	let listData = restData;
	const firstItemServiceType = serviceTypes.find(
		({ id }) => id === firstItem?.service_type_id
	);
	if (inProgress)
		listData = nextProcesses.filter(({ id }) => id !== processInProgress.id);
	return (
		<>
			{processesError && (
				<div className="mb-4">
					<Alert variant="danger" title="Es ist ein Fehler aufgetreten">
						<Typography.Text>{processesError}</Typography.Text>
					</Alert>
				</div>
			)}
			{firstItem && (
				<NextCall {...firstItem} serviceType={firstItemServiceType} />
			)}
			<List processes={listData} />
		</>
	);
};
