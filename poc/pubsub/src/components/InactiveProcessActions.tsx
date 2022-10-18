import { Button } from "@supabase/ui";
import { FC } from "react";
import { ProcessType } from "../clean-types";
import { useProcessActions } from "../utils/useProcessActions";

interface ProcessActionsPropsType {
	process: ProcessType;
	onError?: (error: string, process: ProcessType) => void;
	onCompleted?: (process: ProcessType) => void;
	onEdit?: (process: ProcessType) => void;
}

export const InactiveProcessActions: FC<ProcessActionsPropsType> = ({
	process,
	onError = console.log,
	onCompleted = console.log,
	onEdit = console.log,
}) => {
	const { callProcess, completeProcess } = useProcessActions(process, {
		onCompleted,
		onError,
	});

	return (
		<>
			<Button onClick={completeProcess} type="text">
				Erledigt
			</Button>
			<Button onClick={() => onEdit(process)} type="secondary">
				Anpassen
			</Button>
			<Button onClick={callProcess}>Aufrufen</Button>
		</>
	);
};
