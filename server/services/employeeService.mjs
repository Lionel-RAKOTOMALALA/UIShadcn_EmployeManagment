import mysql from 'mysql2/promise';
import { config } from '../config/database.mjs';

export class EmployeeService {
  constructor() {
    this.pool = mysql.createPool(config);
  }

  calculateObservation(salaire) {
    if (salaire < 1000) return 'mediocre';
    if (salaire <= 5000) return 'moyen';
    return 'grand';
  }

  async getAllEmployees() {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM employees ORDER BY created_at DESC');
      return rows.map(employee => ({
        ...employee,
        observation: this.calculateObservation(employee.salaire)
      }));
    } finally {
      connection.release();
    }
  }

  async createEmployee({ nom, salaire }) {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO employees (nom, salaire) VALUES (?, ?)',
        [nom, salaire]
      );
      const [newEmployee] = await connection.query(
        'SELECT * FROM employees WHERE numEmp = ?',
        [result.insertId]
      );
      return {
        ...newEmployee[0],
        observation: this.calculateObservation(salaire)
      };
    } finally {
      connection.release();
    }
  }

  async updateEmployee(numEmp, { nom, salaire }) {
    const connection = await this.pool.getConnection();
    try {
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
    } finally {
      connection.release();
    }
  }

  async deleteEmployee(numEmp) {
    const connection = await this.pool.getConnection();
    try {
      await connection.query('DELETE FROM employees WHERE numEmp = ?', [numEmp]);
    } finally {
      connection.release();
    }
  }
} 