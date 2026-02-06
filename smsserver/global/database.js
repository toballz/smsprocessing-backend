import pkg from "pg";
const { Pool } = pkg;
const DATABASE_URL = process.env.DATABASE_URL;

export default new Pool({
  connectionString: DATABASE_URL
});