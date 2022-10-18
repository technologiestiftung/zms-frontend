// import { Auth } from "@supabase/ui"; // TODO: Add userId to process when implemented in DB
import { useCallback } from "react";
import { ProcessType } from "../clean-types";
import { useStore } from "./Store";
import { supabase } from "./supabase";

export const useProcessActions = (
	process: ProcessType,
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
	editProcess: (newProcess: Partial<ProcessType>) => Promise<void>;
} => {
	const [processInProgress, setStore] = useStore((s) => s.processInProgress);
	const [processes] = useStore((s) => s.processes);
	// const { user } = Auth.useUser(); // TODO: Add userId to process when implemented in DB

	const restoreProcess = useCallback(async () => {
		const resetProps = { start_time: null, end_time: null };
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

	const cancelProcessCall = useCallback(async () => {
		if (processInProgress) {
			setStore({
				processInProgress: null,
				actionLoading: true,
				actionError: null,
				processes: processes.map((p) => {
					if (p.id === process.id) {
						return { ...p, start_time: null, end_time: null };
					}
					return p;
				}),
			});
			const { error } = await supabase
				.from<ProcessType>("processes")
				.update({ start_time: null, end_time: null })
				.match({ id: processInProgress.id });
			if (error) {
				console.log(error);
				config?.onError && config.onError(error.message, process);
				setStore({
					processInProgress,
					actionLoading: false,
					actionError: error.message,
					processes,
				});
				return;
			}
			config?.onCancelled && config.onCancelled(process);
			setStore({
				processInProgress: null,
				actionLoading: false,
				actionError: null,
			});
		}
	}, [config, process, processInProgress, processes, setStore]);

	const callProcess = useCallback(async () => {
		if (processInProgress) {
			await cancelProcessCall();
		}
		const start_time = new Date().toISOString();
		setStore({
			processInProgress: { ...process, start_time },
			actionLoading: true,
			actionError: null,
			processes: processes.map((p) => {
				if (p.id === process.id) {
					return { ...p, start_time };
				}
				return p;
			}),
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ start_time, end_time: null })
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
		setStore,
		process,
		processes,
		config,
		cancelProcessCall,
	]);

	const completeProcess = useCallback(async () => {
		const end_time = new Date().toISOString();
		setStore({
			processInProgress: null,
			actionLoading: true,
			actionError: null,
			processes: processes.map((p) => {
				if (p.id === process.id) return { ...p, end_time };
				return p;
			}),
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ end_time })
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
	}, [setStore, process, config, processes]);

	const editProcess = useCallback(
		async (newProcess: Partial<ProcessType>) => {
			setStore({
				actionLoading: true,
				actionError: null,
				processes: processes.map((p) => {
					if (p.id === process.id) {
						return { ...p, ...newProcess };
					}
					return p;
				}),
			});
			const { error } = await supabase
				.from<ProcessType>("processes")
				.update(newProcess)
				.eq("id", process.id);
			if (error) {
				console.log(error);
				config?.onError && config.onError(error.message, process);
				setStore({
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
		[setStore, process, config, processes]
	);

	return {
		editProcess,
		completeProcess,
		callProcess,
		cancelProcessCall,
		restoreProcess,
	};
};
