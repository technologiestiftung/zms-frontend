/// <reference types="vite/client" />

declare module "mock-progress-react" {
	export function useMockProgress(): {
		progress: number;
		start: () => void;
		finish: () => void;
	};
}
