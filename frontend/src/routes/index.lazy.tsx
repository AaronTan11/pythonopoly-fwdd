import { Button } from "@/components/ui/button";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const [count, setCount] = useState(0);
	const [connectedClients, setConnectedClients] = useState(0);
	const [socket, setSocket] = useState<any>(null);

	useEffect(() => {
		const newSocket = io("/");
		setSocket(newSocket);

		newSocket.on("initialData", (data: { count: number; connectedClients: number }) => {
			setCount(data.count);
			setConnectedClients(data.connectedClients);
		});

		newSocket.on("count", (newCount: number) => {
			setCount(newCount);
		});

		newSocket.on("clientsUpdate", (clients: number) => {
			setConnectedClients(clients);
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	const handleIncrement = () => {
		if (socket) {
			socket.emit("increment");
		}
	};

	const handleReset = () => {
		if (socket) {
			socket.emit("reset");
		}
	};

	return (
		<div className='w-10/12 md:w-5/12 mx-auto content-center h-[90vh] text-center space-y-5'>
			<h1 className='text-3xl'>Count: {count}</h1>
			<p>Connected Clients: {connectedClients}</p>
			<Button className='w-full' onClick={handleIncrement}>
				Add 1
			</Button>
			<Button className='w-full' onClick={handleReset}>
				Reset
			</Button>
		</div>
	);
}
