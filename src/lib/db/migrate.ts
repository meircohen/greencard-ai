import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import path from 'path';

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('Starting database migrations...');
  console.log(`Database URL: ${process.env.DATABASE_URL.split('://')[0]}://...`);

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const migrationsFolder = path.join(process.cwd(), 'migrations');
    console.log(`Migrations folder: ${migrationsFolder}`);

    await migrate(db, { migrationsFolder });

    console.log('✓ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
};

runMigrations();
