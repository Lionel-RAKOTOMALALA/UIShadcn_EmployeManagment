import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { visitorApi, Visitor } from '../services/api';
import { z } from 'zod';

// Validation schema
export const visitorSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  days: z.number().min(1, 'Le nombre de jours doit être au moins 1'),
  dailyRate: z.number().min(0, 'Le tarif journalier doit être positif'),
});

interface VisitorContextType {
  visitors: Visitor[];
  loading: boolean;
  error: string | null;
  fetchVisitors: () => Promise<void>;
  addVisitor: (visitor: Omit<Visitor, 'id' | 'totalAmount'>) => Promise<void>;
  updateVisitor: (id: number, visitor: Partial<Visitor>) => Promise<void>;
  deleteVisitor: (id: number) => Promise<void>;
}

const VisitorContext = createContext<VisitorContextType | null>(null);

export const VisitorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await visitorApi.getAllVisitors();
      setVisitors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  const addVisitor = useCallback(async (visitor: Omit<Visitor, 'id' | 'totalAmount'>) => {
    setError(null);
    try {
      const newVisitor = await visitorApi.createVisitor(visitor);
      setVisitors(prev => [newVisitor, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du visiteur');
      throw err;
    }
  }, []);

  const updateVisitor = useCallback(async (id: number, visitor: Partial<Visitor>) => {
    setError(null);
    try {
      const updatedVisitor = await visitorApi.updateVisitor(id, visitor);
      setVisitors(prev =>
        prev.map(v => (v.id === id ? updatedVisitor : v))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du visiteur');
      throw err;
    }
  }, []);

  const deleteVisitor = useCallback(async (id: number) => {
    setError(null);
    try {
      await visitorApi.deleteVisitor(id);
      setVisitors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du visiteur');
      throw err;
    }
  }, []);

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        loading,
        error,
        fetchVisitors,
        addVisitor,
        updateVisitor,
        deleteVisitor,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor doit être utilisé à l\'intérieur d\'un VisitorProvider');
  }
  return context;
};