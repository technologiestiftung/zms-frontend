export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			process_service_types: {
				Row: {
					process_id: number;
					service_type_id: number;
				};
				Insert: {
					process_id: number;
					service_type_id: number;
				};
				Update: {
					process_id?: number;
					service_type_id?: number;
				};
			};
			processes: {
				Row: {
					id: number;
					service_id: number;
					scheduled_time: string;
					start_time: string | null;
					end_time: string | null;
					notes: string | null;
					score: number | null;
					check_in_time: string;
				};
				Insert: {
					id?: number;
					service_id: number;
					scheduled_time: string;
					start_time?: string | null;
					end_time?: string | null;
					notes?: string | null;
					score?: number | null;
					check_in_time?: string;
				};
				Update: {
					id?: number;
					service_id?: number;
					scheduled_time?: string;
					start_time?: string | null;
					end_time?: string | null;
					notes?: string | null;
					score?: number | null;
					check_in_time?: string;
				};
			};
			profiles: {
				Row: {
					id: string;
					description: string | null;
				};
				Insert: {
					id: string;
					description?: string | null;
				};
				Update: {
					id?: string;
					description?: string | null;
				};
			};
			service_types: {
				Row: {
					id: number;
					name: string;
				};
				Insert: {
					id?: number;
					name: string;
				};
				Update: {
					id?: number;
					name?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			add_service_types_to_process: {
				Args: { pid: number; service_type_ids: unknown };
				Returns: Record<string, unknown>[];
			};
			compute_scores: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
