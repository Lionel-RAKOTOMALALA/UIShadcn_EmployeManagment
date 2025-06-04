import pool from '../config/db.mjs';

export class VisitorService {
  async getAllVisitors() {
    try {
      console.log('Fetching all visitors...');
      const [rows] = await pool.query('SELECT * FROM visitors ORDER BY created_at DESC');
      console.log(`Found ${rows.length} visitors`);
      return rows;
    } catch (error) {
      console.error('Error fetching visitors:', error);
      throw error;
    }
  }

  async createVisitor({ name, days, dailyRate }) {
    try {
      console.log('Creating new visitor:', { name, days, dailyRate });
      const totalAmount = days * dailyRate;
      const [result] = await pool.query(
        'INSERT INTO visitors (name, days, daily_rate, total_amount) VALUES (?, ?, ?, ?)',
        [name, days, dailyRate, totalAmount]
      );
      const newVisitor = {
        id: result.insertId,
        name,
        days,
        dailyRate,
        totalAmount,
      };
      console.log('Visitor created:', newVisitor);
      return newVisitor;
    } catch (error) {
      console.error('Error creating visitor:', error);
      throw error;
    }
  }

  async updateVisitor(id, { name, days, dailyRate }) {
    try {
      console.log('Updating visitor:', { id, name, days, dailyRate });
      const totalAmount = days * dailyRate;
      await pool.query(
        'UPDATE visitors SET name = ?, days = ?, daily_rate = ?, total_amount = ? WHERE id = ?',
        [name, days, dailyRate, totalAmount, id]
      );
      const updatedVisitor = {
        id: parseInt(id),
        name,
        days,
        dailyRate,
        totalAmount,
      };
      console.log('Visitor updated:', updatedVisitor);
      return updatedVisitor;
    } catch (error) {
      console.error('Error updating visitor:', error);
      throw error;
    }
  }

  async deleteVisitor(id) {
    try {
      console.log('Deleting visitor:', id);
      await pool.query('DELETE FROM visitors WHERE id = ?', [id]);
      console.log('Visitor deleted successfully');
    } catch (error) {
      console.error('Error deleting visitor:', error);
      throw error;
    }
  }
}