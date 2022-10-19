import { Auth } from "@supabase/ui";
import { Container } from "./components/Container";
import { supabase } from "./utils/supabase";

function App() {
	return (
		<Auth.UserContextProvider supabaseClient={supabase}>
			<Container>
				<Auth supabaseClient={supabase} magicLink={false} providers={[]} />
			</Container>
		</Auth.UserContextProvider>
	);
}

export default App;
