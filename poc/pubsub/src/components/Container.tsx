import { RealtimeSubscription } from "@supabase/supabase-js";
import { Auth, IconFlag, IconMonitor, Modal, Tabs } from "@supabase/ui";
import { useCallback, useEffect, useState } from "react";
import { ProcessType, ServiceType } from "../clean-types";
import { DeskService } from "../tabs/DeskService";
import { ReceptionService } from "../tabs/ReceptionService";
import { useStore } from "../utils/Store";
import { supabase } from "../utils/supabase";
import { Header } from "./Header";
import { Progress } from "../components/Progress";

interface ContainerProps {
	children: JSX.Element | JSX.Element[];
}
export const Container = ({ children }: ContainerProps): JSX.Element => {
	const { user } = Auth.useUser();
	const [activeTab, setActiveTab] = useState<string>("reception");
	const [currentlyEditedProcess, setStore] = useStore(
		(s) => s.currentlyEditedProcess
	);
	const [change, setChange] = useState<number>(0);

	useEffect(() => {
		const loadServiceTypes = async (): Promise<void> => {
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
		};
		loadServiceTypes();
	}, [setStore]);

	const updateList = useCallback(async () => {
		const { data: processes, error } = await supabase
			.from<ProcessType>("processes")
			.select("*")
			.filter("active", "eq", true);

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
			<Modal
				visible={!!currentlyEditedProcess}
				title={`Eintrag mit ZMS ID ${currentlyEditedProcess?.service_id}`}
				onCancel={() => setStore({ currentlyEditedProcess: null })}
			>
				<h1>EDIT ME</h1>
			</Modal>
			<Progress />
		</>
	);
};
