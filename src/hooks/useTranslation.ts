import { useCallback } from 'react';
import { useSettingsStore } from '../store/settingsStore';

type TranslationKey = string;

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  fr: {
    employeeManagement: 'Gestion des Employés',
    search: 'Rechercher...',
    employeesOverview: 'Aperçu des Employés',
    addEmployee: 'Ajouter un Employé',
    employee: 'Employé',
    salary: 'Salaire',
    observation: 'Observation',
    actions: 'Actions',
    noEmployees: 'Aucun employé trouvé',
    editEmployee: 'Modifier l\'employé',
    newEmployee: 'Nouvel employé',
    name: 'Nom',
    cancel: 'Annuler',
    save: 'Enregistrer',
    add: 'Ajouter',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet employé ?',
    mediocre: 'Médiocre',
    moyen: 'Moyen',
    grand: 'Grand',
    settings: 'Paramètres',
    languageSettings: 'Langue',
    languageSettingsDescription: 'Sélectionnez la langue de l\'interface',
    currencySettings: 'Devise',
    currencySettingsDescription: 'Sélectionnez la devise pour les montants',
    appearanceSettings: 'Apparence',
    appearanceSettingsDescription: 'Personnalisez l\'apparence de l\'application',
    darkMode: 'Mode sombre'
  },
  en: {
    employeeManagement: 'Employee Management',
    search: 'Search...',
    employeesOverview: 'Employees Overview',
    addEmployee: 'Add Employee',
    employee: 'Employee',
    salary: 'Salary',
    observation: 'Observation',
    actions: 'Actions',
    noEmployees: 'No employees found',
    editEmployee: 'Edit Employee',
    newEmployee: 'New Employee',
    name: 'Name',
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    confirmDelete: 'Are you sure you want to delete this employee?',
    mediocre: 'Poor',
    moyen: 'Average',
    grand: 'Great',
    settings: 'Settings',
    languageSettings: 'Language',
    languageSettingsDescription: 'Select the interface language',
    currencySettings: 'Currency',
    currencySettingsDescription: 'Select the currency for amounts',
    appearanceSettings: 'Appearance',
    appearanceSettingsDescription: 'Customize the application appearance',
    darkMode: 'Dark mode'
  },
  es: {
    employeeManagement: 'Gestión de Empleados',
    search: 'Buscar...',
    employeesOverview: 'Resumen de Empleados',
    addEmployee: 'Añadir Empleado',
    employee: 'Empleado',
    salary: 'Salario',
    observation: 'Observación',
    actions: 'Acciones',
    noEmployees: 'No se encontraron empleados',
    editEmployee: 'Editar Empleado',
    newEmployee: 'Nuevo Empleado',
    name: 'Nombre',
    cancel: 'Cancelar',
    save: 'Guardar',
    add: 'Añadir',
    confirmDelete: '¿Está seguro de que desea eliminar este empleado?',
    mediocre: 'Pobre',
    moyen: 'Promedio',
    grand: 'Excelente',
    settings: 'Configuración',
    languageSettings: 'Idioma',
    languageSettingsDescription: 'Seleccione el idioma de la interfaz',
    currencySettings: 'Moneda',
    currencySettingsDescription: 'Seleccione la moneda para los importes',
    appearanceSettings: 'Apariencia',
    appearanceSettingsDescription: 'Personalice la apariencia de la aplicación',
    darkMode: 'Modo oscuro'
  }
};

export const useTranslation = () => {
  const { language, updateLanguage } = useSettingsStore();

  const t = useCallback((key: TranslationKey): string => {
    return translations[language]?.[key] || key;
  }, [language]);

  const setLanguage = useCallback((lang: string) => {
    updateLanguage(lang);
  }, [updateLanguage]);

  return { t, setLanguage };
}; 