import { Alert, Auth, Typography } from "@supabase/ui";
import { isToday } from "date-fns";
import { FC } from "react";
import { List } from "../components/List";
import { NextCall } from "../components/NextCall";
import { useStore } from "../utils/Store";

export const DeskService: FC = () => {
	const [serviceTypes] = useStore((s) => s.serviceTypes);
	const [processes] = useStore((s) => s.processes);
	const [processesError] = useStore((s) => s.processesError);
	const [processInProgress] = useStore((s) => s.processInProgress);
	const { user } = Auth.useUser();

	if (!user) return null;

	const processesOfToday = processes.filter(
		({ check_in_time, scheduled_time }) =>
			isToday(new Date(check_in_time)) &&
			scheduled_time &&
			isToday(new Date(scheduled_time))
	);
	const calledProcesses = processesOfToday.filter(
		(p) => !!p.start_time && !p.end_time && p.id !== processInProgress?.id
	);
	const doneProcesses = processesOfToday.filter((p) => !!p.end_time);
	const nextProcesses = processesOfToday.filter(
		(p) => !p.start_time && !p.end_time
	);
	const firstItem = nextProcesses[0];
	return (
		<>
			{nextProcesses.length === 0 && (
				<div className="mb-4">
					<Alert variant="info" title="Heute hat noch niemand eingecheckt">
						<Typography.Text>
							Warten Sie auf die ersten Besucher. Diese werden hier angezeigt.
						</Typography.Text>
					</Alert>
				</div>
			)}
			{processesError && (
				<div className="mb-4">
					<Alert variant="danger" title="Es ist ein Fehler aufgetreten">
						<Typography.Text>{processesError}</Typography.Text>
					</Alert>
				</div>
			)}
			{nextProcesses.length > 0 && (
				<>
					<NextCall {...firstItem} />
					<h2 className="mb-2 mt-8">Nächste Aufrufe</h2>
					<hr className="mb-3" />
					<List processes={nextProcesses} />
				</>
			)}
			{calledProcesses.length > 0 && (
				<>
					<h2 className="mb-2 mt-8">Im Bearbeitung</h2>
					<hr className="mb-3" />
					<List processes={calledProcesses} />
				</>
			)}
			{doneProcesses.length > 0 && (
				<>
					<h2 className="mb-2 mt-8">Erledigt</h2>
					<hr className="mb-3" />
					<List processes={doneProcesses} />
				</>
			)}
		</>
	);
};
