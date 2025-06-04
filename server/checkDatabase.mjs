import mysql from 'mysql2/promise';
import { config } from './config/database.mjs';

async function checkDatabase() {
  console.log('Testing database connection...');
  console.log('Configuration:', config);

  try {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });

    console.log('Connected to MySQL server');

    // Check if database exists
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${config.database}'`
    );

    if (rows.length === 0) {
      console.log(`Database '${config.database}' does not exist`);
      console.log('Creating database...');
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
      console.log('Database created successfully');
    } else {
      console.log(`Database '${config.database}' exists`);
    }

    // Use the database
    await connection.query(`USE ${config.database}`);

    // Drop the existing table if it exists
    console.log('Dropping existing employees table...');
    await connection.query('DROP TABLE IF EXISTS employees');

    // Create the employees table with the correct structure
    console.log('Creating employees table...');
    await connection.query(`
      CREATE TABLE employees (
        numEmp INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        salaire DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table created successfully');

    await connection.end();
    console.log('Database check completed successfully');
  } catch (error) {
    console.error('Database check failed:', error);
    process.exit(1);
  }
}

checkDatabase(); 