import "./assets/App.css";
import { Auth } from "@supabase/ui";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./db-types";
import { Container } from "./components/Container";

export type Process = Database["public"]["Tables"]["processes"]["Row"];
export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL || "http://localhost:54321",
	import.meta.env.VITE_SUPABASE_ANON_KEY ||
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs"
);

function App() {
	return (
		<Auth.UserContextProvider supabaseClient={supabase}>
			<Container supabaseClient={supabase}>
				<Auth supabaseClient={supabase} />
			</Container>
		</Auth.UserContextProvider>
	);
}

export default App;
