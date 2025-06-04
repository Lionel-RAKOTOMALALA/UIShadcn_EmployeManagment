import mysql from 'mysql2/promise';
import { config } from '../config/database.mjs';

export class EmployeeService {
  constructor() {
    console.log('Initializing database connection with config:', config);
    this.pool = mysql.createPool(config);
  }

  calculateObservation(salaire) {
    if (salaire < 1000) return 'mediocre';
    if (salaire <= 5000) return 'moyen';
    return 'grand';
  }

  async getAllEmployees() {
    console.log('Getting database connection...');
    const connection = await this.pool.getConnection();
    try {
      console.log('Executing SELECT query...');
      const [rows] = await connection.query('SELECT * FROM employees ORDER BY numEmp DESC');
      console.log('Query result:', rows);
      return rows.map(employee => ({
        ...employee,
        observation: this.calculateObservation(employee.salaire)
      }));
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      console.log('Releasing connection...');
      connection.release();
    }
  }

  async createEmployee({ nom, salaire }) {
    console.log('Getting database connection for create...');
    const connection = await this.pool.getConnection();
    try {
      console.log('Executing INSERT query...', { nom, salaire });
      const [result] = await connection.query(
        'INSERT INTO employees (nom, salaire) VALUES (?, ?)',
        [nom, salaire]
      );
      console.log('Insert result:', result);
      const [newEmployee] = await connection.query(
        'SELECT * FROM employees WHERE numEmp = ?',
        [result.insertId]
      );
      return {
        ...newEmployee[0],
        observation: this.calculateObservation(salaire)
      };
    } catch (error) {
      console.error('Database error during create:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateEmployee(numEmp, { nom, salaire }) {
    console.log('Getting database connection for update...');
    const connection = await this.pool.getConnection();
    try {
      console.log('Executing UPDATE query...', { numEmp, nom, salaire });
      await connection.query(
        'UPDATE employees SET nom = ?, salaire = ? WHERE numEmp = ?',
        [nom, salaire, numEmp]
      );
      const [updatedEmployee] = await connection.query(
        'SELECT * FROM employees WHERE numEmp = ?',
        [numEmp]
      );
      return {
        ...updatedEmployee[0],
        observation: this.calculateObservation(salaire)
      };
    } catch (error) {
      console.error('Database error during update:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteEmployee(numEmp) {
    console.log('Getting database connection for delete...');
    const connection = await this.pool.getConnection();
    try {
      console.log('Executing DELETE query...', { numEmp });
      await connection.query('DELETE FROM employees WHERE numEmp = ?', [numEmp]);
    } catch (error) {
      console.error('Database error during delete:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
} 