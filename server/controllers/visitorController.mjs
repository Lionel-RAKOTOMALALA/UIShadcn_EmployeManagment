import { VisitorService } from '../services/visitorService.mjs';

const visitorService = new VisitorService();

export class VisitorController {
  async getAllVisitors(req, res) {
    try {
      const visitors = await visitorService.getAllVisitors();
      res.json(visitors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createVisitor(req, res) {
    try {
      const { name, days, dailyRate } = req.body;
      const visitor = await visitorService.createVisitor({ name, days, dailyRate });
      res.status(201).json(visitor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateVisitor(req, res) {
    try {
      const { id } = req.params;
      const { name, days, dailyRate } = req.body;
      const visitor = await visitorService.updateVisitor(id, { name, days, dailyRate });
      res.json(visitor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteVisitor(req, res) {
    try {
      const { id } = req.params;
      await visitorService.deleteVisitor(id);
      res.json({ message: 'Visitor deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}