import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0206',
  database: 'chat_app',
  waitForConnections: true,
  connectionLimit: 10,
});