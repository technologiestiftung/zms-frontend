import { RealtimeSubscription } from "@supabase/supabase-js";
import { Alert, Auth, Typography } from "@supabase/ui";
import { FC, useCallback, useEffect, useState } from "react";
import { List } from "../components/List";
import { NextCall } from "../components/NextCall";
import { Database } from "../db-types";
import { useStore } from "../utils/Store";
import { supabase } from "../utils/supabase";
import { useServiceTypes } from "../utils/useServiceTypes";

type Process = Database["public"]["Tables"]["processes"]["Row"];

export const DeskService: FC = () => {
	const [processInProgress] = useStore((s) => s.processInProgress);
	const [serviceTypes] = useStore((s) => s.serviceTypes);
	const [processes] = useStore((s) => s.processes);
	const [processesError] = useStore((s) => s.processesError);
	const inProgress = !!processInProgress;
	const { user } = Auth.useUser();

	if (!user) return null;

	const [firstItem, ...restData] = processes.filter((p) => !p.end_time);
	let listData = restData;
	const firstItemServiceType = serviceTypes.find(
		({ id }) => id === firstItem?.service_type_id
	);
	if (inProgress)
		listData = processes.filter(({ id }) => id !== processInProgress.id);
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
