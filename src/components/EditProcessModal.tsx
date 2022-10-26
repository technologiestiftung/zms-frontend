import { Dialog } from "@headlessui/react";
import { FC } from "react";
import { useStore } from "../utils/Store";
import { EditProcessForm } from "./EditProcessForm";

export const EditProcessModal: FC = () => {
	const [currentlyEditedProcess, setStore] = useStore(
		(s) => s.currentlyEditedProcess
	);
	return (
		<Dialog
			open={!!currentlyEditedProcess}
			onClose={() => setStore({ currentlyEditedProcess: null })}
		>
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="mx-auto max-w-xl rounded bg-white">
					{currentlyEditedProcess && (
						<>
							<Dialog.Title className="p-8 font-bold text-xl">
								Vorgangsnummer {currentlyEditedProcess.service_id}{" "}
								bearbeiten
							</Dialog.Title>
							<EditProcessForm />
						</>
					)}
				</Dialog.Panel>
			</div>
		</Dialog>
	);
};
