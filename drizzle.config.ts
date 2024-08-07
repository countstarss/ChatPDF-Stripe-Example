/*
MARK: - DOTENV
TODO: 之所以使用dotenv是因为Next.js只能在"/src"文件夹内识别 ".env "
*/
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/lib/db/schema.ts", //TODO: `配置Schema文件位置`
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});