import { FC } from "react";
import { MultiSelect, SelectProps } from "react-multi-select-component";
import classNames from "../utils/classNames";
import { useStore } from "../utils/Store";

export type ValueType = SelectProps["value"];

interface ServiceTypesSelectPropsType {
	value: ValueType;
	onChange: SelectProps["onChange"];
	error?: string | null;
}

export const ServiceTypesSelect: FC<ServiceTypesSelectPropsType> = ({
	value,
	onChange,
	error,
}) => {
	const [serviceTypesLoading] = useStore((s) => s.serviceTypesLoading);
	const [serviceTypes] = useStore((s) => s.serviceTypes);

	const customValueRenderer = (selected: ValueType) => {
		return (
			<div className="flex gap-1 flex-wrap">
				{selected.length ? (
					selected.map(({ label, value }) => (
						<span
							key={value}
							title={label}
							className={classNames(
								error ? "bg-red-600" : "bg-brand",
								"text-white text-sm px-2 py-0.5",
								"rounded min-w-[150px] max-w-xs inline-block truncate"
							)}
						>
							{label}
						</span>
					))
				) : (
					<span className="ml-3 text-gray-400">Kein Auswahl</span>
				)}
			</div>
		);
	};

	return (
		<div className="sbui-formlayout sbui-formlayout--medium sbui-formlayout--responsive">
			<div className="sbui-space-row sbui-space-x-2 sbui-formlayout__label-container-horizontal">
				<label className="sbui-formlayout__label" id="add-process-select-label">
					Erbrachte Dienstleistung
				</label>
			</div>
			<div className="sbui-formlayout__content-container-horizontal">
				<MultiSelect
					value={value}
					onChange={onChange}
					hasSelectAll={false}
					isLoading={serviceTypesLoading}
					labelledBy="add-process-select-label"
					options={serviceTypes.map((serviceType) => ({
						label: serviceType.name,
						value: serviceType.id,
					}))}
					valueRenderer={customValueRenderer}
					className={error ? "error" : ""}
					overrideStrings={{
						allItemsAreSelected: "Alle Dienstleistungen",
						clearSearch: "Suche zurücksetzen",
						clearSelected: "Auswahl aufheben",
						noOptions: "Keine Optionen",
						search: "Suchen",
						selectAll: "Alle auswählen",
						selectAllFiltered: "Alle auswählen (Gefiltert)",
						selectSomeItems: "Auswählen...",
						create: "Dienstleistung anlegen",
					}}
				/>
				{error && <div className="mt-2 text-red-700 text-xs">{error}</div>}
			</div>
		</div>
	);
};
