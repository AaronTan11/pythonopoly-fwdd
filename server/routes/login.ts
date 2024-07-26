import { Hono } from "hono";

import { db } from "../db";
import { lucia } from "../lib/auth.js";
import { verify } from "@node-rs/argon2";

import type { DatabaseUser } from "../db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "../lib/context.js";
import { userTable } from "../db/schema";

export const loginRouter = new Hono<Context>();

loginRouter.post("/login", async (c) => {
	const body = await c.req.parseBody<{
		username: string;
		password: string;
	}>();
	const username = body.username;
	const password = body.password;

	if (
		!username ||
		username.length < 3 ||
		username.length > 31 ||
		!password ||
		password.length < 6 ||
		password.length > 255
	) {
		return c.json({ error: "Invalid username or password" }, 400);
	}

	// const existingUser = db.prepare("SELECT * FROM user WHERE username = ?").get(username) as
	// 	| DatabaseUser
	// 	| undefined;

	const existingUser = await db.select().from(userTable).where(eq(userTable.username, username));

	if (!existingUser) {
		return c.json({ error: "Incorrect username or password" }, 400);
	}

	const validPassword = await verify(existingUser[0].password_hash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	if (!validPassword) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid usernames from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid usernames.
		// However, valid usernames can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
		// If usernames are public, you can outright tell the user that the username is invalid.
		return c.json({ error: "Incorrect username or password" }, 400);
	}

	const session = await lucia.createSession(existingUser[0].id, {});
	c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
	return c.json({ success: true });
});
