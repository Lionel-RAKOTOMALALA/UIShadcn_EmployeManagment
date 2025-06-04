import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Shield, 
  Globe, 
  DollarSign, 
  PaintBucket,
  Moon,
  Sun,
  User,
  Loader2
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../hooks/useTranslation';
import Swal from 'sweetalert2';

const Settings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const { 
    profile,
    currency,
    language,
    emailNotifications,
    loading,
    error,
    updateProfile,
    updateCurrency,
    updateLanguage,
    toggleEmailNotifications,
    updatePassword
  } = useSettingsStore();

  const [formProfile, setFormProfile] = useState({
    name: profile.name,
    email: profile.email
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile(formProfile);
      await Swal.fire({
        title: t('success'),
        text: t('profileUpdateSuccess'),
        icon: 'success',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: t('profileUpdateError'),
        icon: 'error'
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordForm({ oldPassword: '', newPassword: '' });
      await Swal.fire({
        title: t('success'),
        text: t('passwordUpdateSuccess'),
        icon: 'success',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: error instanceof Error ? error.message : t('generalError'),
        icon: 'error'
      });
    }
  };

  const handleSaveAll = async () => {
    try {
      updateProfile(formProfile);
      await Swal.fire({
        title: t('success'),
        text: t('settingsSaved'),
        icon: 'success',
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: t('settingsSaveError'),
        icon: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('settings')}</h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-500/20 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Profil */}
      <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <User className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
          {t('adminProfile')}
        </h3>
        <div className="flex items-start space-x-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {formProfile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('name')}</label>
                <input
                  type="text"
                  value={formProfile.name}
                  onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('email')}</label>
                <input
                  type="email"
                  value={formProfile.email}
                  onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                  className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t('updateProfile')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Apparence */}
      <div className="bg-white dark:bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <PaintBucket className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
          {t('appearance')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{t('theme')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('themeDescription')}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-900 dark:text-gray-300 flex items-center space-x-2 transition-colors border border-gray-200 dark:border-gray-700"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span>{t('lightMode')}</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-blue-500" />
                  <span>{t('darkMode')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Préférences */}
      <div className="bg-white dark:bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Globe className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
          {t('regionalPreferences')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('currency')}</label>
            <select
              value={currency}
              onChange={(e) => updateCurrency(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar US ($)</option>
              <option value="GBP">Livre Sterling (£)</option>
              <option value="MGA">Ariary (Ar)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('language')}</label>
            <select
              value={language}
              onChange={(e) => updateLanguage(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="mg">Malagasy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Bell className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
          {t('notifications')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{t('emailNotifications')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('emailNotificationsDescription')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={toggleEmailNotifications}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
          {t('security')}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('oldPassword')}</label>
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('newPassword')}</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t('updatePassword')
            )}
          </button>
        </div>
      </form>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-md transition-colors"
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            t('saveChanges')
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings; 