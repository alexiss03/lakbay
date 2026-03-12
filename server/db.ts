import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as adminSchema from "@shared/admin-schema";
import * as chatSchema from "@shared/chat-schema";
import * as accommodationSchema from "@shared/accommodation-schema";

neonConfig.webSocketConstructor = ws;

const dbSchema = {
  ...schema,
  ...adminSchema,
  ...chatSchema,
  ...accommodationSchema,
};

const missingDatabaseMessage =
  "DATABASE_URL is not set. Configure a database connection to use database-backed endpoints.";

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const missingDatabaseProxy = new Proxy(
  {},
  {
    get() {
      return () => {
        throw new Error(missingDatabaseMessage);
      };
    },
  },
) as any;

export const db = pool
  ? drizzle({ client: pool, schema: dbSchema })
  : missingDatabaseProxy;
