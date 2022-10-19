import { ProcessType, ServiceType } from "../clean-types";
import createFastContext from "./createFastContext";

interface StoreType {
	processInProgress: null | ProcessType;
	currentlyEditedProcess: null | ProcessType;
	processes: ProcessType[];
	processesLoading: boolean;
	processesError: string | null;
	serviceTypesLoading: boolean;
	serviceTypesError: string | null;
	serviceTypes: ServiceType[];
	actionLoading: boolean;
	actionError: string | null;
}

const { Provider, useStore: originalUseStore } = createFastContext<StoreType>({
	processInProgress: null,
	currentlyEditedProcess: null,
	processes: [],
	processesLoading: true,
	processesError: null,
	serviceTypes: [],
	serviceTypesLoading: true,
	serviceTypesError: null,
	actionLoading: false,
	actionError: null,
});

export const useStore = originalUseStore;
export const StoreProvider = Provider;
