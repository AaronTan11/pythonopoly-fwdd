import { userQueryOptions } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(userQueryOptions);
	},

	component: Users,
});

function Users() {
	const usersQuery = useSuspenseQuery(userQueryOptions);
	const users = usersQuery.data;
	return (
		<>
			<p>{users.map((user) => user.username).join(", ")}</p>
		</>
	);
}
