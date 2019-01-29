import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import(/* wepackChunkName: "signin" */ './views/Login.vue')
    },
    {
      path: '/question/:id',
      name: 'detail',
      component: () => import(/* wepackChunkName: "detail" */ './views/detail.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import(/* wepackChunkName: "mypage" */ './views/mypage.vue')
    }
  ]
})
