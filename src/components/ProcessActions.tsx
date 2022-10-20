import { Button } from "@supabase/ui";
import { FC } from "react";
import { ProcessType } from "../clean-types";
import { useStore } from "../utils/Store";
import { useProcessActions } from "../utils/useProcessActions";

interface ProcessActionsPropsType {
	process: ProcessType;
	onError?: (error: string, process: ProcessType) => void;
	onCancelled?: (process: ProcessType) => void;
	onCalled?: (process: ProcessType) => void;
	onCompleted?: (process: ProcessType) => void;
	onEdit?: (process: ProcessType) => void;
	onRestored?: (process: ProcessType) => void;
}

export const ProcessActions: FC<ProcessActionsPropsType> = ({
	process,
	onError = (...args) => console.log("onError", ...args),
	onCancelled = (...args) => console.log("onCancelled", ...args),
	onCalled = (...args) => console.log("onCalled", ...args),
	onCompleted = (...args) => console.log("onCompleted", ...args),
	onEdit = (...args) => console.log("onEdit", ...args),
	onRestored = (...args) => console.log("onRestored", ...args),
}) => {
	// const { user } = Auth.useUser(); // TODO: Change for this when editorID exists in DB
	const [processInProgress, setStore] = useStore((s) => s.processInProgress);
	const { callProcess, cancelProcessCall, completeProcess, restoreProcess } =
		useProcessActions(process, {
			onCompleted,
			onError,
			onCancelled,
			onCalled,
			onRestored,
		});

	const isCalled = !!process.start_time && !process.end_time;
	const isNext = !process.start_time && !process.end_time;
	const isDone = !!process.end_time;
	// const isOwned = process.editorId === user?.id; // TODO: Change for this when editorID exists in DB
	const isOwned = process.id === processInProgress?.id;
	const isOwnedAndCalled = isCalled && isOwned;

	return (
		<>
			{isDone && (
				<Button onClick={restoreProcess} type="text">
					Widerherstellen
				</Button>
			)}
			{isCalled && (
				<Button onClick={() => cancelProcessCall()} type="text">
					Abbrechen
				</Button>
			)}
			{!isDone && (isOwned || isNext) && !isOwnedAndCalled && (
				<Button onClick={completeProcess} type="text">
					Erledigt
				</Button>
			)}
			<Button
				onClick={() => {
					onEdit(process);
					setStore({ currentlyEditedProcess: process });
				}}
				type={isOwnedAndCalled ? "outline" : "secondary"}
			>
				Anpassen
			</Button>
			{isOwnedAndCalled && (
				<Button onClick={completeProcess} type="secondary">
					Dienstleistungen Erbracht
				</Button>
			)}
			{isNext && <Button onClick={callProcess}>Aufrufen</Button>}
		</>
	);
};
