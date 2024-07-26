import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";

const ReactQueryDevtoolsProduction = React.lazy(() =>
	import("@tanstack/react-query-devtools/build/modern/production.js").then((d) => ({
		default: d.ReactQueryDevtools,
	}))
);

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: RootApp,
});

function RootApp() {
	const [showDevtools, setShowDevtools] = React.useState(false);

	React.useEffect(() => {
		// @ts-expect-error
		window.toggleDevtools = () => setShowDevtools((old) => !old);
	}, []);

	return (
		<>
			<main>
				<Outlet />
				<TanStackRouterDevtools />
			</main>
			<ReactQueryDevtools initialIsOpen />
			{showDevtools && (
				<React.Suspense fallback={null}>
					<ReactQueryDevtoolsProduction />
				</React.Suspense>
			)}
		</>
	);
}
