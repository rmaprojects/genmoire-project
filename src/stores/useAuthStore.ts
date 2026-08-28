import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  featuredTraitId: string;
  joinedDate: string;
}

export const useAuthStore = defineStore('auth', () => {
  const storedAuth = localStorage.getItem('gm_is_logged_in');
  const isLoggedIn = ref<boolean>(storedAuth === 'true');

  const storedUser = localStorage.getItem('gm_user_profile');
  const currentUser = ref<UserProfile>(
    storedUser
      ? JSON.parse(storedUser)
      : {
          id: 'usr-001',
          name: 'Raka',
          email: 'raka@genmoire.id',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
          bio: 'Penikmat kisah fantasi dan sastra klasik. Membaca setiap hari untuk menjelajah dunia baru.',
          featuredTraitId: 'night-owl',
          joinedDate: 'Agustus 2026',
        }
  );

  const saveToStorage = () => {
    localStorage.setItem('gm_is_logged_in', String(isLoggedIn.value));
    localStorage.setItem('gm_user_profile', JSON.stringify(currentUser.value));
  };

  const login = (email: string, _password?: string) => {
    isLoggedIn.value = true;
    currentUser.value.email = email;
    if (!currentUser.value.name || currentUser.value.name === 'Tamu') {
      currentUser.value.name = email.split('@')[0] || 'Pembaca Genmoire';
    }
    saveToStorage();
    return true;
  };

  const loginWithGoogle = () => {
    isLoggedIn.value = true;
    currentUser.value = {
      id: 'usr-google-88',
      name: 'Raka',
      email: 'raka@genmoire.id',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      bio: 'Penikmat kisah fantasi dan sastra klasik. Membaca setiap hari untuk menjelajah dunia baru.',
      featuredTraitId: 'night-owl',
      joinedDate: 'Agustus 2026',
    };
    saveToStorage();
    return true;
  };

  const register = (name: string, email: string, _password?: string) => {
    isLoggedIn.value = true;
    currentUser.value = {
      id: `usr-${Date.now()}`,
      name: name || 'Pembaca Baru',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      bio: '',
      featuredTraitId: 'curious-mind',
      joinedDate: 'Agustus 2026',
    };
    saveToStorage();
    return true;
  };

  const updateProfile = (name: string, featuredTraitId: string, bio?: string, avatar?: string) => {
    currentUser.value.name = name;
    currentUser.value.featuredTraitId = featuredTraitId;
    if (bio !== undefined) currentUser.value.bio = bio;
    if (avatar !== undefined) currentUser.value.avatar = avatar;
    saveToStorage();
  };

  const updateBio = (bio: string) => {
    currentUser.value.bio = bio;
    saveToStorage();
  };

  const updateAvatar = (avatarUrl: string) => {
    currentUser.value.avatar = avatarUrl;
    saveToStorage();
  };

  const updateName = (name: string) => {
    currentUser.value.name = name;
    saveToStorage();
  };

  const logout = () => {
    isLoggedIn.value = false;
    saveToStorage();
  };

  return {
    isLoggedIn,
    currentUser,
    login,
    loginWithGoogle,
    register,
    updateProfile,
    updateBio,
    updateAvatar,
    updateName,
    logout,
  };
});
