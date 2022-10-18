import { useEffect, useState } from "react";
import { Database } from "../db-types";
import { supabase } from "./supabase";

type ServiceType = Database["public"]["Tables"]["service_types"]["Row"];

export const useServiceTypes = (): {
	error: string | null;
	serviceTypes: ServiceType[];
} => {
	const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadServiceTypes = async (): Promise<void> => {
			const { data, error } = await supabase
				.from<ServiceType>("service_types")
				.select("id,name");
			if (error) {
				setError(error.message);
				return;
			}
			setServiceTypes(data);
		};
		loadServiceTypes();
	}, []);

	return {
		error,
		serviceTypes,
	};
};
