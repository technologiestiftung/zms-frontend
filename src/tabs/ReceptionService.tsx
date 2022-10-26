import { Alert, Auth, Input, Typography } from "@supabase/ui";
import {
	FC,
	useRef,
	FormEventHandler,
	useCallback,
	useState,
	useEffect,
} from "react";
import { supabase } from "../utils/supabase";
import { setMinutes, setHours } from "date-fns";
import { useStore } from "../utils/Store";
import { RawProcessType } from "../clean-types";
import {
	ServiceTypesSelect,
	ValueType,
} from "../components/ServiceTypesSelect";

const parseFormData = (
	data: FormData,
	serviceTypesValue: ValueType
): {
	serviceId: string;
	serviceTypeIds: number[];
	scheduledDate: Date;
	notes: string | null;
} => {
	const rawScheduledTime = data.get("scheduledTime") as string;
	const [hours, minutes] = rawScheduledTime.split(":");
	const scheduledDate = setMinutes(setHours(new Date(), +hours), +minutes);

	const serviceId = data.get("serviceId") as string;

	const notes = data.get("notes") as string | null;

	const serviceTypeIds = serviceTypesValue.map((s) => s.value) as number[];

	return { serviceId, serviceTypeIds, scheduledDate, notes: notes || null };
};

export const ReceptionService: FC = () => {
	const formRef = useRef<HTMLFormElement | null>(null);
	const { user } = Auth.useUser();
	const [serviceTypes] = useStore((s) => s.serviceTypes);
	const [serviceTypesError] = useStore((s) => s.serviceTypesError);
	const [error, setError] = useState<string | null>(null);
	const [serviceTypesValue, setServiceTypesValue] = useState<ValueType>([]);
	const [touched, setTouched] = useState(false);
	const [serviceTypesSelectError, setServiceTypesSelectError] = useState<
		string | null
	>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [textAreaValue, setTextAreaValue] = useState<string>("");

	useEffect(() => {
		if (!touched) return;
		/*
		if (serviceTypesValue.length === 0) {
			setServiceTypesSelectError(
				"Es sollte mindestens eine Dienstleistung ausgewählt werden"
			);
			return;
		}
		*/
		setServiceTypesSelectError(null);
	}, [touched, serviceTypesValue]);

	const submitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
		async (evt): Promise<void> => {
			evt.preventDefault();
			evt.stopPropagation();

			setError(null);
			setSuccessMsg(null);
			setTouched(true);

			if (!formRef.current) return;

			/*
			if (serviceTypesValue.length === 0) {
				setServiceTypesSelectError(
					"Es sollte mindestens eine Dienstleistung ausgewählt werden"
				);
				return;
			}
			*/
			setServiceTypesSelectError(null);

			const rawData = new FormData(formRef.current);
			const { serviceId, serviceTypeIds, scheduledDate, notes } = parseFormData(
				rawData,
				serviceTypesValue
			);

			const { data, error } = await supabase
				.from<RawProcessType>("processes")
				.insert([
					{
						service_id: serviceId,
						scheduled_time: scheduledDate.toISOString(),
						notes,
					},
				]);

			if (error) {
				setError(error.message);
				return;
			}

			if (!data || data.length === 0) {
				setError("Adding the process didn't work");
				return;
			}

			try {
				await supabase.rpc("add_service_types_to_process", {
					pid: data[0].id,
					service_type_ids: serviceTypeIds,
				});
			} catch (err) {
				setError((err as Error).message);
			}

			const processServiceTypes = serviceTypeIds
				.map(
					(s) => serviceTypes.find((serviceType) => serviceType.id === s)?.name
				)
				.filter(Boolean)
				.join(", ");
			setSuccessMsg(
				`Ein neuer Checkin mit der Vorgangsnummer ${serviceId} wurde angelegt.`
			);

			formRef.current.reset();
			formRef.current.focus();
			setServiceTypesValue([]);
			setTextAreaValue("");
			setTouched(false);
		},
		[serviceTypes, serviceTypesValue]
	);

	if (!user) return null;
	return (
		<>
			<form
				ref={formRef}
				name="processForm"
				onSubmit={submitHandler}
				className="container mx-auto max-w-2xl"
			>
				{(serviceTypesError || error) && (
					<div className="mb-4">
						<Alert variant="danger" title="Es ist ein Fehler aufgetreten">
							<Typography.Text className="w-full">
								{serviceTypesError || error}
							</Typography.Text>
						</Alert>
					</div>
				)}
				{successMsg && (
					<div className="mb-4">
						<Alert variant="success" title="Erfolg!" closable>
							<Typography.Text>{successMsg}</Typography.Text>
						</Alert>
					</div>
				)}
				<fieldset className="flex flex-col gap-6 w-full mb-6">
					<Input
						name="serviceId"
						placeholder="Geben Sie die Vorgangsnummer ein"
						label="Vorgangsnummer"
						required
					/>
					<ServiceTypesSelect
						value={serviceTypesValue}
						onChange={setServiceTypesValue}
						error={serviceTypesSelectError}
					/>
					<Input
						name="scheduledTime"
						placeholder="Uhrzeit des gebuchten Termines"
						label="Uhrzeit des gebuchten Termines"
						required
						type="time"
					/>
					<Input.TextArea
						name="notes"
						placeholder="Tragen Sie Bemerkungen und Hinweise hier ein"
						label="Notizen (optional)"
						value={textAreaValue}
						onChange={(evt) => setTextAreaValue(evt.target.value)}
					/>
				</fieldset>
				<div className="sbui-btn-container">
					<input
						type="submit"
						value="Checkin anlegen"
						className="sbui-btn sbui-btn-primary sbui-btn-container--shadow sbui-btn--medium sbui-btn--text-align-center"
					/>
				</div>
			</form>
		</>
	);
};
