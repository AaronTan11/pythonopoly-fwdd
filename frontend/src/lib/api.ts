import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");

// const API_BASE_URL = "/api";
export const api = client.api;

async function getUsers() {
	const res = await api.users.$get();
	if (!res.ok) {
		throw new Error("server error");
	}
	const data = await res.json();
	return data;
}

export const userQueryOptions = queryOptions({
	queryKey: ["get-users"],
	queryFn: getUsers,
	staleTime: Infinity,
});

// export async function signup(username: string, password: string) {
// 	const response = await fetch(`${API_BASE_URL}/signup`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({ username, password }),
// 		credentials: "include",
// 	});
// 	if (!response.ok) {
// 		const error = await response.json();
// 		throw new Error(error.error || "Signup failed");
// 	}
// 	return response.json();
// }

// export async function login(username: string, password: string) {
// 	const response = await fetch(`${API_BASE_URL}/login`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({ username, password }),
// 		credentials: "include",
// 	});
// 	if (!response.ok) {
// 		const error = await response.json();
// 		throw new Error(error.error || "Login failed");
// 	}
// 	return response.json();
// }

// export async function logout() {
// 	const response = await fetch(`${API_BASE_URL}/logout`, {
// 		method: "POST",
// 		credentials: "include",
// 	});
// 	if (!response.ok) {
// 		const error = await response.json();
// 		throw new Error(error.error || "Logout failed");
// 	}
// 	return response.json();
// }
