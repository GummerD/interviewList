import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, 
  RouteLocationNormalized, 
  NavigationGuardNext 
} from 'vue-router'

import { useUserStore } from '@/stores/useUserStore'

import PageHome from '@/views/PageHome.vue'
import PageAuth from '@/views/PageAuth.vue'

const checkAuth = (
  to: RouteLocationNormalized, 
  from: RouteLocationNormalized, 
  next: NavigationGuardNext
) =>{
  const userStore = useUserStore();

  if(!userStore.userId){
    next({name: 'Auth'})
  } else{
    next()
  }

}

const routes:  RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: PageHome,
    beforeEnter: checkAuth
  },
  {
    path: '/auth',
    name: 'Auth',
    component: PageAuth
  },
  // еще один способ передачи адреса страници
  {
    path: '/interview/:id',
    name: 'Interview',
    component: () => import('@/views/PageInterview.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/PageInterviewList.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/statistic',
    name: 'Statistic',
    component: () => import('@/views/PageStatistic.vue'),
    beforeEnter: checkAuth
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
