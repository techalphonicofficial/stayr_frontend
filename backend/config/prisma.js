import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^mysql:\/\//, 'mariadb://') : undefined;

// PrismaMariaDb in Prisma 7.9.1 acts as an adapter factory that expects a connection string
const adapter = new PrismaMariaDb(dbUrl);
const prisma = new PrismaClient({ adapter });

export default prisma;

