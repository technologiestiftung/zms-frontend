import { Auth, IconFlag, IconMonitor, Tabs } from "@supabase/ui";
import { DeskService } from "../tabs/DeskService";
import { ReceptionService } from "../tabs/ReceptionService";
import { Header } from "./Header";

interface ContainerProps {
	children: JSX.Element | JSX.Element[];
}
export const Container = ({ children }: ContainerProps): JSX.Element => {
	const { user } = Auth.useUser();

	return (
		<>
			<div className="p-4 text-lg">
				{!user || Array.isArray(children) ? (
					<div className="flex flex-col items-center justify-center h-screen">
						<h1 className="text-2xl font-bold">Login / Signup</h1>
						<div className="max-w-sm">{children}</div>
					</div>
				) : (
					<>
						<Header />
						<Tabs type="underlined" size="medium">
							<Tabs.Panel id="reception" label="Empfang" icon={<IconFlag />}>
								<ReceptionService />
							</Tabs.Panel>
							<Tabs.Panel id="desk" label="Dienstplatz" icon={<IconMonitor />}>
								<DeskService />
							</Tabs.Panel>
						</Tabs>
					</>
				)}
			</div>
		</>
	);
};
