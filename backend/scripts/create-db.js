import mysql from 'mysql2/promise';
import 'dotenv/config';

async function createDb() {
  const url = process.env.DATABASE_URL;
  // mysql://root:qwop%401920@localhost:3307/stayr
  const match = url.match(/mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);
  if (!match) {
    console.error('Invalid DATABASE_URL');
    process.exit(1);
  }
  
  const [, user, password, host, port, database] = match;
  
  try {
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port, 10),
      user,
      password: decodeURIComponent(password)
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database ${database} created successfully.`);
    await connection.end();
  } catch (err) {
    console.error('Failed to create database:', err);
    process.exit(1);
  }
}

createDb();
