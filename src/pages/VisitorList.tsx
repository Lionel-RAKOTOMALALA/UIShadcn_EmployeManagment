import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { useVisitorStore } from '../store/visitorStore';
import { useTranslation } from '../hooks/useTranslation';
import { useGlobalSettings } from '../hooks/useGlobalSettings';

const VisitorList = () => {
  const { visitors, loading, error, fetchVisitors, addVisitor, updateVisitor, deleteVisitor } = useVisitorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    days: '',
    dailyRate: ''
  });
  const tableRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { formatCurrency } = useGlobalSettings();

  useEffect(() => {
    console.log('VisitorList mounted, fetching visitors...');
    fetchVisitors();

    return () => {
      gsap.killTweensOf(".visitor-row");
    };
  }, [fetchVisitors]);

  useEffect(() => {
    if (!loading && visitors.length > 0 && tableRef.current) {
      gsap.killTweensOf(".visitor-row");
      
      gsap.fromTo(
        ".visitor-row",
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
  }, [loading, visitors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = {
        name: formData.name,
        days: Number(formData.days),
        dailyRate: Number(formData.dailyRate)
      };

      if (editingVisitor !== null) {
        await updateVisitor(editingVisitor, validatedData);
        await Swal.fire({
          title: 'Succès !',
          text: 'Visiteur mis à jour avec succès',
          icon: 'success',
          timer: 2000
        });
      } else {
        await addVisitor(validatedData);
        await Swal.fire({
          title: 'Succès !',
          text: 'Visiteur ajouté avec succès',
          icon: 'success',
          timer: 2000
        });
      }

      setIsModalOpen(false);
      setEditingVisitor(null);
      setFormData({ name: '', days: '', dailyRate: '' });
    } catch (error) {
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez vérifier les valeurs saisies',
        icon: 'error'
      });
    }
  };

  const handleEdit = (visitor: any) => {
    setEditingVisitor(visitor.id);
    setFormData({
      name: visitor.name,
      days: visitor.days.toString(),
      dailyRate: visitor.dailyRate.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await deleteVisitor(id);
        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le visiteur a été supprimé.',
          icon: 'success',
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          title: 'Erreur !',
          text: 'Impossible de supprimer le visiteur',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('visitors')}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors shadow-lg"
          disabled={loading}
        >
          <Plus className="h-5 w-5" />
          <span>{t('newVisitor')}</span>
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
            <span className="ml-2 text-gray-100">Chargement des visiteurs...</span>
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center p-8 text-gray-100">
            Aucun visiteur trouvé. Ajoutez votre premier visiteur !
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('days')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('dailyRate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('totalAmount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="visitor-row hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {visitor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {visitor.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(visitor.dailyRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(visitor.totalAmount || visitor.days * visitor.dailyRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(visitor)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        disabled={loading}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(visitor.id!)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingVisitor !== null ? t('editVisitor') : t('newVisitor')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('days')}
                </label>
                <input
                  type="number"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dailyRate')}
                </label>
                <input
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
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
                    setEditingVisitor(null);
                    setFormData({ name: '', days: '', dailyRate: '' });
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md transition-colors shadow-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    editingVisitor !== null ? t('save') : t('add')
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

export default VisitorList;