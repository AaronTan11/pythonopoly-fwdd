import { mysqlTable, varchar, datetime, int } from "drizzle-orm/mysql-core";

// declaring enum in database
export const userTable = mysqlTable("user", {
	id: varchar("id", {
		length: 255,
	}).primaryKey(),
	username: varchar("username", {
		length: 255,
	})
		.notNull()
		.unique(),
	password_hash: varchar("password_hash", {
		length: 255,
	}).notNull(),
	github_id: int("github_id").unique(),
});

export const sessionTable = mysqlTable("session", {
	id: varchar("id", {
		length: 255,
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 255,
	})
		.notNull()
		.references(() => userTable.id),
	expiresAt: datetime("expires_at").notNull(),
});

// db.exec(`CREATE TABLE IF NOT EXISTS user (
//     id TEXT NOT NULL PRIMARY KEY,
//     github_id INTEGER UNIQUE,
//     username TEXT NOT NULL
// )`);
// db.exec(`CREATE TABLE IF NOT EXISTS user (
//     id TEXT NOT NULL PRIMARY KEY,
//     username TEXT NOT NULL UNIQUE,
//     password_hash TEXT NOT NULL
// )`);

// db.exec(`CREATE TABLE IF NOT EXISTS session (
//     id TEXT NOT NULL PRIMARY KEY,
//     expires_at INTEGER NOT NULL,
//     user_id TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES user(id)
// )`);

// db.exec(`CREATE TABLE IF NOT EXISTS session (
//     id TEXT NOT NULL PRIMARY KEY,
//     expires_at INTEGER NOT NULL,
//     user_id TEXT NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES user(id)
// )`);

// export interface DatabaseUser {
// 	id: string;
// 	username: string;
// 	github_id: number;
// }
export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
	github_id: number;
}
