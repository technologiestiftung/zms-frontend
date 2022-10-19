import { Auth } from "@supabase/ui";
import { Container } from "./components/Container";
import { StoreProvider } from "./utils/Store";
import { supabase } from "./utils/supabase";

function App() {
	return (
		<Auth.UserContextProvider supabaseClient={supabase}>
			<StoreProvider>
				<Container>
					<Auth supabaseClient={supabase} magicLink={false} providers={[]} />
				</Container>
			</StoreProvider>
		</Auth.UserContextProvider>
	);
}

export default App;
