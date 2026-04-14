import type { Config } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL || 'postgres://localhost/greencard';

export default {
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config;
