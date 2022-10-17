import { Button } from "@supabase/ui";
import { FC } from "react";

interface ProcessActionsPropsType {
	rowId: number;
}

export const ProcessActions: FC<ProcessActionsPropsType> = () => {
	return (
		<>
			<Button type="text">Löschen</Button>
			<Button type="secondary">Anpassen</Button>
			<Button>Aufrufen</Button>
		</>
	);
};
