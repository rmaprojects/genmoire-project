import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { title: 'Genmoire — Buku Digital Visual Interaktif', showHeader: true },
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: () => import('@/views/HowItWorksView.vue'),
    meta: { title: 'Cara Kerja — Genmoire', showHeader: true },
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Masuk atau Daftar — Genmoire', showHeader: true },
  },
  {
    path: '/login',
    redirect: '/auth',
  },
  {
    path: '/register',
    redirect: '/auth',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Koleksi Buku & Dasbor — Genmoire', showHeader: true, requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Profil Pembaca — Genmoire', showHeader: true, requiresAuth: true },
  },
  {
    path: '/tiers',
    name: 'tiers-showcase',
    component: () => import('@/views/TiersShowcaseView.vue'),
    meta: { title: 'Tangga Pangkat Pembaca — Genmoire', showHeader: true },
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/ForumView.vue'),
    meta: { title: 'Forum Komunitas — Genmoire', showHeader: true, requiresAuth: true },
  },
  {
    path: '/book/:bookId',
    name: 'book-detail',
    component: () => import('@/views/BookDetailView.vue'),
    meta: { title: 'Detail Buku — Genmoire', showHeader: true },
    props: true,
  },
  {
    path: '/read/:bookId',
    name: 'reader',
    component: () => import('@/views/ReaderView.vue'),
    meta: {
      title: 'Membaca — Genmoire Visual Novel Reader',
      showHeader: false, // Immersive full-screen visual novel
      lockDarkMode: true, // Strictly dark mode for cinematic NVL
    },
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 Tidak Ditemukan — Genmoire', showHeader: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  const themeStore = useThemeStore();
  const authStore = useAuthStore();

  if (to.meta.lockDarkMode) {
    themeStore.setReaderViewLock(true);
  } else {
    themeStore.setReaderViewLock(false);
  }

  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // If user is logged in and tries to access landing page ('/') or auth pages, redirect to dashboard
  if (authStore.isLoggedIn && (to.name === 'landing' || to.name === 'auth')) {
    next({ name: 'dashboard' });
    return;
  }

  // Auth guard: If route requires auth and user is not logged in, redirect to auth
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'auth' });
    return;
  }

  next();
});

export default router;
