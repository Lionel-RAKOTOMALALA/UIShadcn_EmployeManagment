import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Visitor {
  id?: number;
  name: string;
  days: number;
  dailyRate: number;
  totalAmount?: number;
}

export const visitorApi = {
  getAllVisitors: async () => {
    const response = await axios.get(`${API_URL}/visitors`);
    return response.data;
  },

  createVisitor: async (visitor: Omit<Visitor, 'id' | 'totalAmount'>) => {
    const response = await axios.post(`${API_URL}/visitors`, visitor);
    return response.data;
  },

  updateVisitor: async (id: number, visitor: Partial<Visitor>) => {
    const response = await axios.put(`${API_URL}/visitors/${id}`, visitor);
    return response.data;
  },

  deleteVisitor: async (id: number) => {
    await axios.delete(`${API_URL}/visitors/${id}`);
  }
};