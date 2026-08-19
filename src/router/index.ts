import { createRouter, createWebHistory } from 'vue-router'

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
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
