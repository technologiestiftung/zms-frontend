import { useMockProgress } from "mock-progress-react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useStore } from "../utils/Store";
import { FC, useEffect, useRef, useState } from "react";
import classNames from "../utils/classNames";

const Bar: FC<{ isLoading: boolean }> = ({ isLoading }) => {
	const wasLoading = useRef(false);
	const { progress, start, finish } = useMockProgress();

	useEffect(() => {
		let toEnd = 0;
		if (!wasLoading.current && isLoading) start();
		if (wasLoading.current && !isLoading) {
			toEnd = setTimeout(() => finish(), 100);
		}
		wasLoading.current = isLoading;
		return () => clearTimeout(toEnd);
	}, [finish, isLoading, start]);

	return (
		<ProgressBar
			completed={progress}
			className="rounded-none"
			height="2px"
			isLabelVisible={false}
			borderRadius="0"
			bgColor="#24b47e"
			transitionDuration="200ms"
		/>
	);
};

export const Progress: FC = () => {
	const wasLoading = useRef(false);
	const [show, setShow] = useState(false);
	const [renderBar, setRenderBar] = useState(false);
	const [isLoading] = useStore(
		(s) =>
			s.profilesLoading ||
			s.actionLoading ||
			s.processesLoading ||
			s.serviceTypesLoading
	);

	useEffect(() => {
		let toHideContainer = 0;
		let toHideBar = 0;
		if (!wasLoading.current && isLoading) {
			setShow(true);
			setRenderBar(true);
		}
		if (wasLoading.current && !isLoading) {
			toHideContainer = setTimeout(() => setShow(false), 1000);
			toHideBar = setTimeout(() => setRenderBar(false), 1400);
		}
		wasLoading.current = isLoading;
		return () => {
			clearTimeout(toHideContainer);
			clearTimeout(toHideBar);
		};
	}, [isLoading]);

	return (
		<div
			className={classNames(
				"fixed inset-0 bottom-auto pointer-events-none",
				"transition-opacity",
				show ? "opacity-100" : "opacity-0"
			)}
		>
			{renderBar && <Bar isLoading={isLoading} />}
		</div>
	);
};
