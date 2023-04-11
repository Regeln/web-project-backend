import * as dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PWD,
    port: process.env.POSTGRES_PORT,
  });

export { pool };