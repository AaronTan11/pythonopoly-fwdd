import { Hono } from "hono";
import { Server } from "socket.io";

const ws = new Hono();

let count = 0;
let connectedClients = 0;

export function setupWebSocketRoutes(io: Server) {
	io.on("connection", (socket) => {
		connectedClients++;
		console.log("A user connected. Total clients:", connectedClients);

		socket.emit("initialData", { count, connectedClients });
		io.emit("clientsUpdate", connectedClients);

		socket.on("increment", () => {
			count++;
			io.emit("count", count);
		});

		socket.on("reset", () => {
			count = 0;
			io.emit("count", count);
		});

		socket.on("disconnect", () => {
			connectedClients--;
			console.log("User disconnected. Total clients:", connectedClients);
			io.emit("clientsUpdate", connectedClients);
		});
	});
}

export default ws;
