import express from 'express';
import { VisitorController } from '../controllers/visitorController.mjs';

const router = express.Router();
const visitorController = new VisitorController();

// Get all visitors
router.get('/', (req, res) => visitorController.getAllVisitors(req, res));

// Add a new visitor
router.post('/', (req, res) => visitorController.createVisitor(req, res));

// Update a visitor
router.put('/:id', (req, res) => visitorController.updateVisitor(req, res));

// Delete a visitor
router.delete('/:id', (req, res) => visitorController.deleteVisitor(req, res));

export default router;