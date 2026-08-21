import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: () => import('../views/HotelList.vue'),
    },
    {
      path: '/hotels/:id',
      name: 'hotel-detail',
      component: () => import('../views/HotelDetail.vue'),
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/Contact.vue'),
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: () => import('../views/Connexion.vue'),
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('../views/Inscription.vue'),
    },
    {
      path: '/mon-compte',
      name: 'mon-compte',
      component: () => import('../views/MonCompte.vue'),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Garde de navigation : protège les routes marquées requiresAuth.
// On interroge Supabase directement pour éviter une dépendance à un état réactif
// qui ne serait pas encore initialisé.
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getSession()
  if (data.session) return true

  // Non connecté : redirige vers la connexion avec retour vers la page demandée.
  return { name: 'connexion', query: { redirect: to.fullPath } }
})

export default router
