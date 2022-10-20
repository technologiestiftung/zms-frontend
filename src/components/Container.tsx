import { RealtimeSubscription } from "@supabase/supabase-js";
import { Alert, Auth, IconFlag, IconMonitor, Tabs } from "@supabase/ui";
import { useCallback, useEffect, useState } from "react";
import { ProcessType, ProfileType, ServiceType } from "../clean-types";
import { DeskService } from "../tabs/DeskService";
import { ReceptionService } from "../tabs/ReceptionService";
import { useStore } from "../utils/Store";
import { supabase } from "../utils/supabase";
import { Header } from "./Header";
import { Progress } from "../components/Progress";
import { EditProcessModal } from "./EditProcessModal";

interface ContainerProps {
	children: JSX.Element | JSX.Element[];
}
export const Container = ({ children }: ContainerProps): JSX.Element => {
	const { user } = Auth.useUser();
	const [activeTab, setActiveTab] = useState<string>("reception");
	const [processInProgress, setStore] = useStore((s) => s.processInProgress);
	const [error] = useStore(
		(s) =>
			s.profilesError ||
			s.actionError ||
			s.processesError ||
			s.serviceTypesError
	);
	const [processes] = useStore((s) => s.processes);
	const [change, setChange] = useState<number>(0);

	useEffect(() => {
		if (processInProgress || !user?.id) return;
		const ownedProcessInProgress = processes.find(
			(p) => p.profile_id === user?.id && p.start_time && !p.end_time
		);
		if (!ownedProcessInProgress) return;
		setStore({ processInProgress: ownedProcessInProgress });
	}, [processInProgress, processes, setStore, user?.id]);

	useEffect(() => {
		if (!processInProgress) return;
		const progressProcess = processes.find(
			(p) => p.id === processInProgress.id
		);
		if (
			!progressProcess?.start_time ||
			(progressProcess?.start_time && progressProcess?.end_time)
		) {
			setStore({ processInProgress: null });
		}
	}, [processInProgress, processes, setStore]);

	const updateServiceTypes = useCallback(async (): Promise<void> => {
		const { data, error } = await supabase
			.from<ServiceType>("service_types")
			.select("id,name");
		if (error) {
			setStore({
				serviceTypesError: error.message,
				serviceTypesLoading: false,
			});
			return;
		}
		setStore({
			serviceTypes: data,
			serviceTypesLoading: false,
			serviceTypesError: null,
		});
	}, [setStore]);

	const updateProfiles = useCallback(async (): Promise<void> => {
		const { data, error } = await supabase
			.from<ProfileType>("profiles")
			.select("id,description");
		if (error) {
			setStore({
				profilesError: error.message,
				profilesLoading: false,
			});
			return;
		}
		setStore({
			profiles: data.reduce(
				(acc, profile) => ({ ...acc, [profile.id]: profile.description }),
				{}
			),
			profilesLoading: false,
			profilesError: null,
		});
	}, [setStore]);

	const updateList = useCallback(async () => {
		const { data: processes, error } = await supabase.from<ProcessType>(
			"processes"
		).select(`
				id,
				service_id,
				scheduled_time,
				start_time,
				end_time,
				notes,
				score,
				check_in_time,
				profile_id,
				service_types(id)
			`);

		if (error) {
			console.error(error);
			setStore({
				processesError: error.message,
				processesLoading: false,
			});
			return;
		}

		setStore({
			processes: processes.sort(
				(a, b) => (b.score || -999) - (a.score || -999)
			),
			processesError: null,
			processesLoading: false,
		});
	}, [setStore]);

	useEffect(() => {
		let subscription: RealtimeSubscription | null = null;
		const sub = async () => {
			subscription = supabase
				.from("processes")
				.on("*", (payload) => {
					console.info("change detected!", payload);
					setChange((prev) => prev + 1);
				})
				.subscribe();
			void updateList();
		};
		sub();
		return () => {
			subscription?.unsubscribe();
		};
	}, [updateList]);

	useEffect(() => {
		if (!user) return;
		updateList();
	}, [user, change, updateList]);

	useEffect(() => {
		if (!user) return;
		updateProfiles();
		updateServiceTypes();
	}, [user, updateProfiles, updateServiceTypes]);

	return (
		<>
			<div className="p-4 text-lg container mx-auto">
				{!user || Array.isArray(children) ? (
					<div className="flex flex-col items-center justify-center h-screen">
						<h1 className="text-2xl font-bold">Login / Signup</h1>
						<div className="max-w-sm">{children}</div>
					</div>
				) : (
					<>
						<Header />
						{error && (
							<Alert
								variant="danger"
								title="Es ist einen Fehler aufgetreten"
								closable
							>
								{error}
							</Alert>
						)}
						<Tabs
							type="underlined"
							size="medium"
							activeId={activeTab}
							onChange={setActiveTab}
						>
							<Tabs.Panel id="reception" label="Empfang" icon={<IconFlag />}>
								<ReceptionService />
							</Tabs.Panel>
							<Tabs.Panel id="desk" label="Dienstplatz" icon={<IconMonitor />}>
								<DeskService />
							</Tabs.Panel>
						</Tabs>
					</>
				)}
			</div>
			{user && <EditProcessModal />}
			<Progress />
		</>
	);
};
