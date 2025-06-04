import { create } from 'zustand';
import { z } from 'zod';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export interface Employee {
  numEmp?: number;
  nom: string;
  salaire: number;
  observation?: string;
}

// Validation schema
export const employeeSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  salaire: z.number().min(0, 'Le salaire doit être positif'),
});

interface EmployeeStore {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'numEmp' | 'observation'>) => Promise<void>;
  updateEmployee: (numEmp: number, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (numEmp: number) => Promise<void>;
  getStatistics: () => {
    totalSalaire: number;
    minSalaire: number;
    maxSalaire: number;
  };
}

const calculateObservation = (salaire: number): string => {
  if (salaire < 1000) return 'mediocre';
  if (salaire <= 5000) return 'moyen';
  return 'grand';
};

const formatEmployeeData = (data: any): Employee => {
  const salaire = Number(data.salaire);
  return {
    numEmp: Number(data.numEmp),
    nom: data.nom,
    salaire: salaire,
    observation: calculateObservation(salaire)
  };
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching employees...');
      const response = await axios.get(`${API_URL}/employees`);
      const formattedEmployees = Array.isArray(response.data) 
        ? response.data.map(formatEmployeeData)
        : [];
      console.log('Fetched employees:', formattedEmployees);
      set({ employees: formattedEmployees, loading: false });
    } catch (error) {
      console.error('Error fetching employees:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des employés',
        loading: false 
      });
    }
  },

  addEmployee: async (employee) => {
    set({ error: null });
    try {
      console.log('Adding employee:', employee);
      const response = await axios.post(`${API_URL}/employees`, {
        nom: employee.nom,
        salaire: Number(employee.salaire)
      });
      const newEmployee = formatEmployeeData(response.data);
      console.log('Added employee:', newEmployee);
      set((state) => ({
        employees: [newEmployee, ...state.employees]
      }));
    } catch (error) {
      console.error('Error adding employee:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'employé' });
      throw error;
    }
  },

  updateEmployee: async (numEmp, employee) => {
    set({ error: null });
    try {
      console.log('Updating employee:', numEmp, employee);
      const response = await axios.put(`${API_URL}/employees/${numEmp}`, {
        nom: employee.nom,
        salaire: Number(employee.salaire)
      });
      const updatedEmployee = formatEmployeeData(response.data);
      console.log('Updated employee:', updatedEmployee);
      set((state) => ({
        employees: state.employees.map((e) =>
          e.numEmp === numEmp ? updatedEmployee : e
        )
      }));
    } catch (error) {
      console.error('Error updating employee:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'employé' });
      throw error;
    }
  },

  deleteEmployee: async (numEmp) => {
    set({ error: null });
    try {
      console.log('Deleting employee:', numEmp);
      await axios.delete(`${API_URL}/employees/${numEmp}`);
      console.log('Deleted employee:', numEmp);
      set((state) => ({
        employees: state.employees.filter((e) => e.numEmp !== numEmp)
      }));
    } catch (error) {
      console.error('Error deleting employee:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'employé' });
      throw error;
    }
  },

  getStatistics: () => {
    const state = get();
    const salaires = state.employees.map(e => e.salaire);
    return {
      totalSalaire: salaires.reduce((sum, salaire) => sum + salaire, 0),
      minSalaire: Math.min(...salaires),
      maxSalaire: Math.max(...salaires)
    };
  }
})); 