import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";
import ws from "./routes/ws";
import { usersRoute } from "./routes/users";

const app = new Hono();
app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/users", usersRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

app.route("/ws", ws);
export default app;
export type ApiRoutes = typeof apiRoutes;
