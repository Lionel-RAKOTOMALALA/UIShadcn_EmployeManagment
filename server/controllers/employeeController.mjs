import { EmployeeService } from '../services/employeeService.mjs';

const employeeService = new EmployeeService();

export class EmployeeController {
  async getAllEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createEmployee(req, res) {
    try {
      const { nom, salaire } = req.body;
      const employee = await employeeService.createEmployee({ nom, salaire });
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEmployee(req, res) {
    try {
      const { numEmp } = req.params;
      const { nom, salaire } = req.body;
      const employee = await employeeService.updateEmployee(numEmp, { nom, salaire });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { numEmp } = req.params;
      await employeeService.deleteEmployee(numEmp);
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
} 