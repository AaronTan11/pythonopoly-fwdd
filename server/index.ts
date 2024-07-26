// import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app";
import { Server } from "socket.io";
import { setupWebSocketRoutes } from "./routes/ws";

const port = 3000;
console.log(`Server is running on port ${port}`);

const server = serve({
	fetch: app.fetch,
	port,
});

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

setupWebSocketRoutes(io);
