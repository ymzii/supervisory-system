import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/user/Login.vue'
import Home from '../components/user/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/Report/Report.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {path:'/home',component:Home,
     redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
        {path:'/categories',component:Cate},
        {path:'/params',component:Params},
        {path:'/goods',component:GoodList},
        {path:'/goods/add',component:Add},
        {path:'/orders',component:Order},
        {path:'/reports',component:Report}
      ]}
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if(!token)return next('/login')
  next()
})

export default router
