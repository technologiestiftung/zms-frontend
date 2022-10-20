// import { Auth } from "@supabase/ui"; // TODO: Add userId to process when implemented in DB
import { Auth } from "@supabase/ui";
import { useCallback } from "react";
import { ProcessType } from "../clean-types";
import { useStore } from "./Store";
import { supabase } from "./supabase";

export const useProcessActions = (
	process: ProcessType | null,
	config?: {
		onError?: (error: string, process: ProcessType) => void;
		onCompleted?: (process: ProcessType) => void;
		onEdited?: (process: ProcessType) => void;
		onCancelled?: (process: ProcessType) => void;
		onCalled?: (process: ProcessType) => void;
		onRestored?: (process: ProcessType) => void;
	}
): {
	cancelProcessCall: () => Promise<void>;
	callProcess: () => Promise<void>;
	completeProcess: () => Promise<void>;
	restoreProcess: () => Promise<void>;
	editProcess: (
		newProcess: Partial<ProcessType> & {
			serviceTypeIds: number[];
		}
	) => Promise<void>;
} => {
	const { user } = Auth.useUser();
	const [processInProgress, setStore] = useStore((s) => s.processInProgress);
	const [processes] = useStore((s) => s.processes);
	// const { user } = Auth.useUser(); // TODO: Add userId to process when implemented in DB

	const restoreProcess = useCallback(async () => {
		if (!process) return;
		const resetProps = { start_time: null, end_time: null, profile_id: null };
		setStore({
			actionLoading: true,
			actionError: null,
			processes: processes.map((p) => {
				if (p.id === process.id) return { ...p, ...resetProps };
				return p;
			}),
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update(resetProps)
			.match({ id: process.id });
		if (error) {
			console.log(error);
			config?.onError && config.onError(error.message, process);
			setStore({
				processes,
				actionLoading: false,
				actionError: error.message,
			});
			return;
		}
		config?.onRestored && config.onRestored(process);
		setStore({
			actionLoading: false,
			actionError: null,
		});
	}, [config, process, setStore, processes]);

	const cancelProcessCall = useCallback(
		async (processToCancel = process) => {
			if (!processToCancel) return;
			setStore({
				processInProgress: null,
				actionLoading: true,
				actionError: null,
				processes: processes.map((p) => {
					if (p.id === processToCancel.id) {
						return { ...p, start_time: null, end_time: null, profile_id: null };
					}
					return p;
				}),
			});
			const { error } = await supabase
				.from<ProcessType>("processes")
				.update({ start_time: null, end_time: null, profile_id: null })
				.match({ id: processToCancel.id });
			if (error) {
				console.log(error);
				config?.onError && config.onError(error.message, processToCancel);
				setStore({
					actionLoading: false,
					actionError: error.message,
					processes,
				});
				return;
			}
			config?.onCancelled && config.onCancelled(processToCancel);
			setStore({
				processInProgress: null,
				actionLoading: false,
				actionError: null,
			});
		},
		[config, process, processes, setStore]
	);

	const callProcess = useCallback(async () => {
		if (!process) return;
		if (processInProgress) await cancelProcessCall(processInProgress);
		const start_time = new Date().toISOString();
		setStore({
			processInProgress: {
				...process,
				start_time,
				profile_id: user?.id || null,
			},
			actionLoading: true,
			actionError: null,
			processes: processes.map((p) => {
				if (p.id === process.id) {
					return { ...p, start_time, profile_id: user?.id || null };
				}
				return p;
			}),
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ start_time, end_time: null, profile_id: user?.id || null })
			.match({ id: process.id });
		if (error) {
			console.log(error);
			config?.onError && config.onError(error.message, process);
			setStore({
				processes,
				processInProgress: null,
				actionLoading: false,
				actionError: error.message,
			});
			return;
		}
		config?.onCalled && config.onCalled(process);
		setStore({
			actionLoading: false,
			actionError: null,
		});
	}, [
		processInProgress,
		cancelProcessCall,
		setStore,
		process,
		user?.id,
		processes,
		config,
	]);

	const completeProcess = useCallback(async () => {
		if (!process) return;
		const end_time = new Date().toISOString();
		setStore({
			processInProgress: null,
			actionLoading: true,
			actionError: null,
			processes: processes.map((p) => {
				if (p.id === process.id)
					return { ...p, end_time, profile_id: user?.id || null };
				return p;
			}),
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ end_time, profile_id: user?.id || null })
			.match({ id: process.id });
		if (error) {
			console.log(error);
			config?.onError && config.onError(error.message, process);
			setStore({
				processInProgress: process,
				actionLoading: false,
				actionError: error.message,
				processes,
			});
			return;
		}
		config?.onCompleted && config.onCompleted(process);
		setStore({
			processInProgress: null,
			actionLoading: false,
			actionError: null,
		});
	}, [setStore, processes, user?.id, process, config]);

	const editProcess = useCallback(
		async (
			rawNewProcess: Partial<ProcessType> & {
				serviceTypeIds: number[];
			}
		) => {
			if (!process) return;
			const { serviceTypeIds, ...newProcess } = rawNewProcess;
			const inProgress =
				process.id === processInProgress?.id
					? { ...processInProgress, ...newProcess }
					: processInProgress;
			setStore({
				processInProgress: inProgress,
				actionLoading: true,
				actionError: null,
				processes: processes.map((p) => {
					if (p.id === process.id) return { ...p, ...newProcess };
					return p;
				}),
			});

			const { error } = await supabase
				.from<ProcessType>("processes")
				.update(newProcess)
				.match({ id: process.id });

			if (error) {
				console.log(error);
				config?.onError && config.onError(error.message, process);
				setStore({
					processInProgress,
					actionLoading: true,
					actionError: error.message,
					processes,
				});
				return;
			}
			try {
				await supabase.rpc("add_service_types_to_process", {
					pid: process.id,
					service_type_ids: serviceTypeIds,
				});
			} catch (err) {
				const error = err as Error;
				console.log(error);
				config?.onError && config.onError(error.message, process);
				setStore({
					processInProgress,
					actionLoading: true,
					actionError: error.message,
					processes,
				});
				return;
			}

			config?.onEdited && config.onEdited(process);
			setStore({
				actionLoading: false,
				actionError: null,
			});
		},
		[process, processInProgress, setStore, processes, config]
	);

	return {
		editProcess,
		completeProcess,
		callProcess,
		cancelProcessCall,
		restoreProcess,
	};
};
