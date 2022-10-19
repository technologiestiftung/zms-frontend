import { Alert, Button, Input, Select, Typography } from "@supabase/ui";
import { FC, useRef, FormEventHandler, useCallback, useState } from "react";
import { supabase } from "../utils/supabase";
import { setMinutes, setHours, format, isValid } from "date-fns";
import { useStore } from "../utils/Store";
import { ProcessType } from "../clean-types";

const parseTime = (val?: string) => {
	if (typeof val !== "string") return null;
	const [hours, minutes] = val.trim().split(":");
	if (hours?.length !== 2 || minutes?.length !== 2) return null;
	return setMinutes(setHours(new Date(), +hours), +minutes);
};

const parseFormData = (
	data: FormData
): {
	serviceId: number;
	serviceTypeId: number;
	scheduledDate: Date;
	checkinDate: Date;
	startDate: Date | null;
	endDate: Date | null;
} => {
	const scheduledDate = parseTime(data.get("scheduledTime") as string);
	const checkinDate = parseTime(data.get("checkinTime") as string);
	const startDate = parseTime(data.get("startTime") as string);
	const endDate = parseTime(data.get("endTime") as string);

	const rawServiceTypeId = data.get("serviceTypeId") || "1";
	const serviceTypeId = (
		typeof rawServiceTypeId === "string" ? parseInt(rawServiceTypeId, 10) : 1
	) as number;

	const rawServiceId = data.get("serviceId") || "1";
	const serviceId = (
		typeof rawServiceId === "string" ? parseInt(rawServiceId, 10) : 1
	) as number;

	return {
		serviceId,
		serviceTypeId,
		scheduledDate: scheduledDate || new Date(),
		checkinDate: checkinDate || new Date(),
		startDate: isValid(startDate) ? startDate : null,
		endDate: isValid(endDate) ? startDate : null,
	};
};

export const EditProcessForm: FC = () => {
	const formRef = useRef<HTMLFormElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [serviceTypes, setStore] = useStore((s) => s.serviceTypes);
	const [serviceTypesError] = useStore((s) => s.serviceTypesError);
	const [currentlyEditedProcess] = useStore((s) => s.currentlyEditedProcess);

	const submitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
		async (evt): Promise<void> => {
			evt.preventDefault();
			evt.stopPropagation();

			setStore({ actionLoading: true });

			setError(null);

			if (!formRef.current || !currentlyEditedProcess) return;

			const rawData = new FormData(formRef.current);
			const parsedData = parseFormData(rawData);

			const { error } = await supabase
				.from<ProcessType>("processes")
				.update({
					service_id: parsedData.serviceId,
					scheduled_time: parsedData.scheduledDate.toISOString(),
					check_in_time: parsedData.checkinDate.toISOString(),
					start_time: parsedData.startDate?.toISOString(),
					end_time: parsedData.endDate?.toISOString(),
				})
				.match({ id: currentlyEditedProcess.id });

			if (error) {
				setError(error.message);
				return;
			}

			try {
				await supabase.rpc("add_service_types_to_process", {
					pid: currentlyEditedProcess.id,
					service_type_ids: [parsedData.serviceTypeId],
				});
			} catch (err) {
				setError((err as Error).message);
			}

			setStore({ currentlyEditedProcess: null, actionLoading: false });
		},
		[currentlyEditedProcess, setStore]
	);

	if (!currentlyEditedProcess) return null;
	return (
		<>
			<form ref={formRef} name="processEditForm" onSubmit={submitHandler}>
				<div className="p-8 border-y border-gray-100">
					{(serviceTypesError || error) && (
						<div className="mb-4">
							<Alert variant="danger" title="Es ist ein Fehler aufgetreten">
								<Typography.Text className="w-full">
									{serviceTypesError || error}
								</Typography.Text>
							</Alert>
						</div>
					)}
					<fieldset className="flex flex-col gap-6 w-full">
						<Input
							name="serviceId"
							placeholder="Geben Sie das ZMS ID hier ein"
							label="ZMS ID"
							required
							type="number"
							defaultValue={currentlyEditedProcess.service_id}
						/>
						<Select
							name="serviceTypeId"
							label="Erbrachte Dienstleistung"
							required
						>
							{serviceTypes.map((serviceType) => (
								<Select.Option value={`${serviceType.id}`} key={serviceType.id}>
									{serviceType.name}
								</Select.Option>
							))}
						</Select>
						<fieldset className="grid grid-cols-2 gap-4">
							<Input
								name="checkinTime"
								placeholder="Uhrzeit des Checkins"
								label="Uhrzeit des Checkins"
								required
								type="time"
								defaultValue={format(
									new Date(currentlyEditedProcess.check_in_time),
									"HH:mm"
								)}
							/>
							<Input
								name="scheduledTime"
								placeholder="Uhrzeit des ZMS Termins"
								label="Uhrzeit des ZMS Termins"
								required
								type="time"
								defaultValue={format(
									new Date(currentlyEditedProcess.scheduled_time!),
									"HH:mm"
								)}
							/>
						</fieldset>
						<fieldset className="grid grid-cols-2 gap-4">
							<Input
								name="startTime"
								label="Uhrzeit des Aufrufs"
								type="time"
								defaultValue={
									currentlyEditedProcess.start_time
										? format(
												new Date(currentlyEditedProcess.start_time),
												"HH:mm"
												// eslint-disable-next-line no-mixed-spaces-and-tabs
										  )
										: ""
								}
							/>
							<Input
								name="endTime"
								label="Uhrzeit des Abschlusses"
								type="time"
								defaultValue={
									currentlyEditedProcess.end_time
										? format(new Date(currentlyEditedProcess.end_time), "HH:mm")
										: ""
								}
							/>
						</fieldset>
					</fieldset>
				</div>
				<footer className="p-8 flex justify-end gap-4">
					<Button
						type="text"
						onClick={() => setStore({ currentlyEditedProcess: null })}
					>
						Abbrechen
					</Button>
					<div className="sbui-btn-container">
						<input
							type="submit"
							value="Prozess editieren"
							className="sbui-btn sbui-btn-primary sbui-btn-container--shadow sbui-btn--medium sbui-btn--text-align-center"
						/>
					</div>
				</footer>
			</form>
		</>
	);
};
