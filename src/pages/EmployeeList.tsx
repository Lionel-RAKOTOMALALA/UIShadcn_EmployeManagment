import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { useEmployeeStore } from '../store/employeeStore';

const EmployeeList = () => {
  const { 
    employees, 
    loading, 
    error, 
    fetchEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    getStatistics 
  } = useEmployeeStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    salaire: ''
  });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('EmployeeList mounted, fetching employees...');
    fetchEmployees();

    return () => {
      gsap.killTweensOf(".employee-row");
    };
  }, [fetchEmployees]);

  useEffect(() => {
    if (!loading && employees.length > 0 && tableRef.current) {
      gsap.fromTo(
        ".employee-row",
        { 
          opacity: 0,
          y: 20
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all"
        }
      );
    }
  }, [loading, employees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee !== null) {
        await updateEmployee(editingEmployee, {
          nom: formData.nom,
          salaire: Number(formData.salaire)
        });
      } else {
        await addEmployee({
          nom: formData.nom,
          salaire: Number(formData.salaire)
        });
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({ nom: '', salaire: '' });
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: error instanceof Error ? error.message : 'Une erreur est survenue',
        icon: 'error'
      });
    }
  };

  const handleEdit = (employee: { numEmp: number; nom: string; salaire: number }) => {
    setEditingEmployee(employee.numEmp);
    setFormData({
      nom: employee.nom,
      salaire: employee.salaire.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (numEmp: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await deleteEmployee(numEmp);
        Swal.fire(
          'Supprimé !',
          'L\'employé a été supprimé avec succès.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Erreur',
          'Une erreur est survenue lors de la suppression.',
          'error'
        );
      }
    }
  };

  const stats = getStatistics();
  const chartData = employees.map(emp => ({
    nom: emp.nom,
    salaire: emp.salaire
  }));

  const getObservationColor = (observation: string) => {
    switch (observation) {
      case 'mediocre':
        return 'text-red-500';
      case 'moyen':
        return 'text-yellow-500';
      case 'grand':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Liste des Employés
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors shadow-lg"
          disabled={loading}
        >
          <Plus className="h-5 w-5" />
          <span>Nouvel Employé</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div ref={tableRef} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-100">Chargement des employés...</span>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center p-8 text-gray-100">
            Aucun employé trouvé. Ajoutez votre premier employé !
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Observation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((employee) => (
                <tr key={employee.numEmp} className="employee-row hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {employee.numEmp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {employee.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {employee.salaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getObservationColor(employee.observation || '')}`}>
                      {employee.observation}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        disabled={loading}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.numEmp!)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Salaire Total</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalSalaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Salaire Minimum</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.minSalaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Salaire Maximum</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.maxSalaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Distribution des Salaires</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nom" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="salaire" fill="#3b82f6" name="Salaire" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingEmployee !== null ? 'Modifier l\'employé' : 'Nouvel employé'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salaire
                </label>
                <input
                  type="number"
                  value={formData.salaire}
                  onChange={(e) => setFormData({ ...formData, salaire: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEmployee(null);
                    setFormData({ nom: '', salaire: '' });
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md transition-colors shadow-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    editingEmployee !== null ? 'Enregistrer' : 'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 