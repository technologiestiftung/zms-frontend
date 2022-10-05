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
      processes: {
        Row: {
          id: number;
          service_id: number;
          scheduled_time: string | null;
          start_time: string | null;
          end_time: string | null;
          notes: string | null;
          score: number | null;
          service_type_id: number | null;
          check_in_time: string;
          active: boolean;
        };
        Insert: {
          id?: number;
          service_id: number;
          scheduled_time?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          notes?: string | null;
          score?: number | null;
          service_type_id?: number | null;
          check_in_time?: string;
          active?: boolean;
        };
        Update: {
          id?: number;
          service_id?: number;
          scheduled_time?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          notes?: string | null;
          score?: number | null;
          service_type_id?: number | null;
          check_in_time?: string;
          active?: boolean;
        };
      };
      service_types: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
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

