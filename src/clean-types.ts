import { Database } from "./db-types";

export type RawProcessType = Database["public"]["Tables"]["processes"]["Row"];
export type ProcessType = RawProcessType & {
	service_types: { id: number }[];
};
export type ServiceType = Database["public"]["Tables"]["service_types"]["Row"];
export type ProfileType = {
	id: string;
	description: string;
};
