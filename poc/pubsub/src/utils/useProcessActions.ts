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
	const [, setStore] = useStore((s) => s.processInProgress);

	const callProcess = useCallback(() => {
		setStore({ processInProgress: process });
		config?.onCalled && config.onCalled(process);
	}, [setStore, process, config]);

	const cancelProcessCall = useCallback(() => {
		setStore({ processInProgress: null });
		config?.onCancelled && config.onCancelled(process);
	}, [config, process, setStore]);

	const completeProcess = useCallback(async () => {
		const { error } = await supabase
			.from<ProcessType>("processes")
			.update({ end_time: new Date().toISOString() })
			.match({ id: process.id });
		if (error) {
			console.log(error);
			config?.onError && config.onError(error.message, process);
			return;
		}
		config?.onCompleted && config.onCompleted(process);
		setStore({ processInProgress: null });
	}, [process, config, setStore]);

	const editProcess = useCallback(
		async (newProcess: Partial<ProcessType>) => {
			const { error } = await supabase
				.from<ProcessType>("processes")
				.update(newProcess)
				.eq("id", process.id);
			if (error) {
				console.log(error);
				config?.onError && config.onError(error.message, process);
				return;
			}
			config?.onEdited && config.onEdited(process);
			setStore({ processInProgress: null });
		},
		[process, config, setStore]
	);

	return {
		editProcess,
		completeProcess,
		callProcess,
		cancelProcessCall,
	};
};
