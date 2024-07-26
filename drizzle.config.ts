import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./server/db/schema.ts",
	out: "./server/drizzle",
	dialect: "mysql", // 'postgresql' | 'mysql' | 'sqlite'
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
