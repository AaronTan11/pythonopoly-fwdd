import { Hono } from "hono";

import { db } from "../db";
import { lucia } from "../lib/auth.js";

import { generateId } from "lucia";
import { hash } from "@node-rs/argon2";

import type { Context } from "../lib/context.js";
import { userTable } from "../db/schema";

export const signupRouter = new Hono<Context>();

signupRouter.post("/signup", async (c) => {
	const body = await c.req.parseBody<{
		username: string;
		password: string;
	}>();
	const username: string | null = body.username ?? null;
	const password: string | null = body.password ?? null;

	if (
		!username ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return c.json({ error: "Invalid username" }, 400);
	}

	if (!password || password.length < 6 || password.length > 255) {
		return c.json({ error: "Invalid password" }, 400);
	}

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	const userId = generateId(15);

	try {
		// db.prepare("INSERT INTO user (id, username, password_hash) VALUES(?, ?, ?)").run(
		// 	userId,
		// 	username,
		// 	passwordHash
		// );

		await db.insert(userTable).values({
			id: userId,
			username: username,
			password_hash: passwordHash,
		});

		const session = await lucia.createSession(userId, {});
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
		return c.json({ success: true });
	} catch (e) {
		if (e instanceof Error && "code" in e && e.code === "ER_DUP_ENTRY") {
			return c.json({ error: "Username already used" }, 400);
		}
		return c.json({ error: "An unknown error occurred" }, 500);
	}
});
