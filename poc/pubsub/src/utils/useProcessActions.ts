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
	}
): {
	cancelProcessCall: () => void;
	callProcess: () => void;
	completeProcess: () => Promise<void>;
	editProcess: (newProcess: Partial<ProcessType>) => Promise<void>;
} => {
	const [processInProgress, setStore] = useStore((s) => s.processInProgress);
	// const { user } = Auth.useUser(); // TODO: Add userId to process when implemented in DB

	const callProcess = useCallback(async () => {
		setStore({
			processInProgress: process,
			actionLoading: true,
			actionError: null,
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ start_time: new Date().toISOString(), end_time: null })
			.match({ id: process.id });
		if (error) {
			console.log(error);
			config?.onError && config.onError(error.message, process);
			setStore({
				processInProgress: null,
				actionLoading: false,
				actionError: error.message,
			});
			return;
		}
		config?.onCalled && config.onCalled(process);
		setStore({
			processInProgress: process,
			actionLoading: false,
			actionError: null,
		});
	}, [config, process, setStore]);

	const cancelProcessCall = useCallback(async () => {
		if (processInProgress) {
			setStore({
				processInProgress: null,
				actionLoading: true,
				actionError: null,
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
	}, [config, process, processInProgress, setStore]);

	const completeProcess = useCallback(async () => {
		setStore({
			processInProgress: null,
			actionLoading: true,
			actionError: null,
		});
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ end_time: new Date().toISOString() })
			.match({ id: process.id });
		if (error) {
			console.log(error);
			config?.onError && config.onError(error.message, process);
			setStore({
				processInProgress: process,
				actionLoading: false,
				actionError: error.message,
			});
			return;
		}
		config?.onCompleted && config.onCompleted(process);
		setStore({
			processInProgress: null,
			actionLoading: false,
			actionError: null,
		});
	}, [process, config, setStore]);

	const editProcess = useCallback(
		async (newProcess: Partial<ProcessType>) => {
			setStore({
				actionLoading: true,
				actionError: null,
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
				});
				return;
			}
			config?.onEdited && config.onEdited(process);
			setStore({
				actionLoading: false,
				actionError: null,
			});
		},
		[setStore, process, config]
	);

	return {
		editProcess,
		completeProcess,
		callProcess,
		cancelProcessCall,
	};
};
