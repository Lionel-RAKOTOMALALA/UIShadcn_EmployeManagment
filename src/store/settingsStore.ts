import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  email: string;
}

interface SettingsState {
  profile: UserProfile;
  currency: string;
  language: string;
  emailNotifications: boolean;
  loading: boolean;
  error: string | null;
  updateProfile: (profile: UserProfile) => void;
  updateCurrency: (currency: string) => void;
  updateLanguage: (language: string) => void;
  toggleEmailNotifications: () => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Admin',
        email: 'admin@visitmanager.com'
      },
      currency: 'EUR',
      language: 'fr',
      emailNotifications: true,
      loading: false,
      error: null,

      updateProfile: (profile) => {
        set({ profile });
        // Ici, vous pourriez ajouter une requête API pour sauvegarder dans la base de données
      },

      updateCurrency: (currency) => {
        set({ currency });
      },

      updateLanguage: (language) => {
        set({ language });
      },

      toggleEmailNotifications: () => {
        set((state) => ({ emailNotifications: !state.emailNotifications }));
      },

      updatePassword: async (oldPassword: string, newPassword: string) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'une requête API
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Vérification basique (à remplacer par une vraie validation côté serveur)
          if (oldPassword === 'admin' || oldPassword === 'password') {
            set({ loading: false });
            return;
          }
          
          throw new Error('Mot de passe incorrect');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Une erreur est survenue',
            loading: false 
          });
          throw error;
        }
      }
    }),
    {
      name: 'settings-storage',
      skipHydration: false,
    }
  )
); 