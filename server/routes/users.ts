import { Hono } from "hono";
import { db } from "../db";
import { userTable } from "../db/schema";

export const usersRoute = new Hono().get("/", async (c) => {
	const users = await db.select().from(userTable);
	return c.json(users);
});
