import express from 'express';
import { EmployeeController } from '../controllers/employeeController.mjs';

const router = express.Router();
const employeeController = new EmployeeController();

// Get all employees
router.get('/', (req, res) => employeeController.getAllEmployees(req, res));

// Create a new employee
router.post('/', (req, res) => employeeController.createEmployee(req, res));

// Update an employee
router.put('/:numEmp', (req, res) => employeeController.updateEmployee(req, res));

// Delete an employee
router.delete('/:numEmp', (req, res) => employeeController.deleteEmployee(req, res));

export default router; 