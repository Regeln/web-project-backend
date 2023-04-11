import pg from "pg";

const pool = new pg.Pool(process.env.POSTGRES_URI);

export { pool };