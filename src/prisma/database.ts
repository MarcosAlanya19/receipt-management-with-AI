import { PrismaClient } from '@prisma/client';
import { SQLDatabase } from 'encore.dev/storage/sqldb';

const DB = new SQLDatabase('appDB', {
  migrations: {
    path: './migrations',
    source: 'prisma',
  },
});

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || DB.connectionString,
    },
  },
});
