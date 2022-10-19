import { Alert, Auth, Input, Select, Typography } from "@supabase/ui";
import { FC, useRef, FormEventHandler, useCallback, useState } from "react";
import { supabase } from "../utils/supabase";
import { useServiceTypes } from "../utils/useServiceTypes";

const parseFormData = (
	data: FormData
): {
	serviceId: string;
	serviceTypeId: number;
} => {
	const serviceId = data.get("serviceId") as string;
	const rawServiceTypeId = data.get("serviceTypeId") || "1";
	const serviceTypeId = (
		typeof rawServiceTypeId === "string" ? parseInt(rawServiceTypeId, 10) : 1
	) as number;
	return { serviceId, serviceTypeId };
};

export const ReceptionService: FC = () => {
	const formRef = useRef<HTMLFormElement | null>(null);
	const { user } = Auth.useUser();
	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const { error: serviceTypesError, serviceTypes } = useServiceTypes();

	const submitHandler = useCallback<FormEventHandler<HTMLFormElement>>(
		async (evt): Promise<void> => {
			evt.preventDefault();
			evt.stopPropagation();

			setError(null);
			setSuccessMsg(null);

			if (!formRef.current) return;

			const rawData = new FormData(formRef.current);
			const { serviceId, serviceTypeId } = parseFormData(rawData);

			const { error } = await supabase.from("processes").insert([
				{
					service_id: serviceId,
					service_type_id: serviceTypeId,
				},
			]);

			if (error) {
				setError(error.message);
				return;
			}

			const serviceType = serviceTypes.find(({ id }) => id === serviceTypeId);
			setSuccessMsg(
				`Ein neuer Checkin für die Dienstlietung "${serviceType?.name}" mit id "${serviceId}" wurde angelegt.`
			);

			formRef.current.reset();
			formRef.current.focus();
		},
		[serviceTypes]
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
						placeholder="Geben Sie das ZMS ID hier ein"
						label="ZMS ID"
						required
						type="number"
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
				</fieldset>
				<div className="sbui-btn-container">
					<input
						type="submit"
						value="Prozess anlegen"
						className="sbui-btn sbui-btn-primary sbui-btn-container--shadow sbui-btn--medium sbui-btn--text-align-center"
					/>
				</div>
			</form>
		</>
	);
};
