import { Button } from "@supabase/ui";
import { FC } from "react";
import { ProcessType } from "../clean-types";
import { useProcessActions } from "../utils/useProcessActions";

interface ProcessActionsPropsType {
	process: ProcessType;
	onError?: (error: string, process: ProcessType) => void;
	onCancelled?: (process: ProcessType) => void;
	onCalled?: (process: ProcessType) => void;
	onCompleted?: (process: ProcessType) => void;
	onEdit?: (process: ProcessType) => void;
}

export const ActiveProcessActions: FC<ProcessActionsPropsType> = ({
	process,
	onError = console.log,
	onCancelled = console.log,
	onCalled = console.log,
	onCompleted = console.log,
	onEdit = console.log,
}) => {
	const { cancelProcessCall, completeProcess } = useProcessActions(process, {
		onCompleted,
		onError,
		onCancelled,
		onCalled,
	});

	return (
		<>
			<Button onClick={cancelProcessCall} type="text">
				Abbrechen
			</Button>
			<Button onClick={() => onEdit(process)} type="outline">
				Anpassen
			</Button>
			<Button onClick={completeProcess} type="secondary">
				Dienstleistungen Erbracht
			</Button>
		</>
	);
};
