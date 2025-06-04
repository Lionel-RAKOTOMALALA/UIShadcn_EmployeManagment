import { create } from 'zustand';
import { z } from 'zod';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export interface Visitor {
  id?: number;
  name: string;
  days: number;
  dailyRate: number;
  totalAmount?: number;
}

// Validation schema
export const visitorSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  days: z.number().min(1, 'Le nombre de jours doit être au moins 1'),
  dailyRate: z.number().min(0, 'Le tarif journalier doit être positif'),
});

interface VisitorStore {
  visitors: Visitor[];
  loading: boolean;
  error: string | null;
  fetchVisitors: () => Promise<void>;
  addVisitor: (visitor: Omit<Visitor, 'id' | 'totalAmount'>) => Promise<void>;
  updateVisitor: (id: number, visitor: Partial<Visitor>) => Promise<void>;
  deleteVisitor: (id: number) => Promise<void>;
}

const formatVisitorData = (data: any): Visitor => {
  return {
    id: Number(data.id),
    name: data.name,
    days: Number(data.days),
    dailyRate: Number(data.daily_rate || data.dailyRate),
    totalAmount: Number(data.total_amount || data.totalAmount)
  };
};

export const useVisitorStore = create<VisitorStore>((set, get) => ({
  visitors: [],
  loading: false,
  error: null,

  fetchVisitors: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching visitors...');
      const response = await axios.get(`${API_URL}/visitors`);
      const formattedVisitors = Array.isArray(response.data) 
        ? response.data.map(formatVisitorData)
        : [];
      console.log('Fetched visitors:', formattedVisitors);
      set({ visitors: formattedVisitors, loading: false });
    } catch (error) {
      console.error('Error fetching visitors:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des visiteurs',
        loading: false 
      });
    }
  },

  addVisitor: async (visitor) => {
    set({ error: null });
    try {
      console.log('Adding visitor:', visitor);
      const response = await axios.post(`${API_URL}/visitors`, {
        name: visitor.name,
        days: Number(visitor.days),
        dailyRate: Number(visitor.dailyRate)
      });
      const newVisitor = formatVisitorData(response.data);
      console.log('Added visitor:', newVisitor);
      set((state) => ({
        visitors: [newVisitor, ...state.visitors]
      }));
    } catch (error) {
      console.error('Error adding visitor:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout du visiteur' });
      throw error;
    }
  },

  updateVisitor: async (id, visitor) => {
    set({ error: null });
    try {
      console.log('Updating visitor:', id, visitor);
      const response = await axios.put(`${API_URL}/visitors/${id}`, {
        name: visitor.name,
        days: Number(visitor.days),
        dailyRate: Number(visitor.dailyRate)
      });
      const updatedVisitor = formatVisitorData(response.data);
      console.log('Updated visitor:', updatedVisitor);
      set((state) => ({
        visitors: state.visitors.map((v) =>
          v.id === id ? updatedVisitor : v
        )
      }));
    } catch (error) {
      console.error('Error updating visitor:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du visiteur' });
      throw error;
    }
  },

  deleteVisitor: async (id) => {
    set({ error: null });
    try {
      console.log('Deleting visitor:', id);
      await axios.delete(`${API_URL}/visitors/${id}`);
      console.log('Deleted visitor:', id);
      set((state) => ({
        visitors: state.visitors.filter((v) => v.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting visitor:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la suppression du visiteur' });
      throw error;
    }
  }
})); 