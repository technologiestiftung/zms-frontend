import { ProcessType, ServiceType } from "../clean-types";
import createFastContext from "./createFastContext";

interface StoreType {
	processInProgress: null | ProcessType;
	processes: ProcessType[];
	processesLoading: boolean;
	processesError: string | null;
	serviceTypesLoading: boolean;
	serviceTypesError: string | null;
	serviceTypes: ServiceType[];
}

const { Provider, useStore: originalUseStore } = createFastContext<StoreType>({
	processInProgress: null,
	processes: [],
	processesLoading: true,
	processesError: null,
	serviceTypes: [],
	serviceTypesLoading: true,
	serviceTypesError: null,
});

export const useStore = originalUseStore;
export const StoreProvider = Provider;
