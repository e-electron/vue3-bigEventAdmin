import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// createRouter 创建路由实例，===> new VueRouter()
// 1. history模式: createWebHistory()   http://xxx/user
// 2. hash模式: createWebHashHistory()  http://xxx/#/user

// vite 的配置 import.meta.env.BASE_URL 是路由的基准地址，默认是 ’/‘
// https://vitejs.dev/guide/build.html#public-base-path

// 如果将来你部署的域名路径是：http://xxx/my-path/user
// vite.config.ts  添加配置  base: my-path，路由这就会加上 my-path 前缀了
const router = createRouter({
  // import.meta.env.BASE_URL处可以写路径前缀，将会在所有路径中都有
  // import.meta.env.BASE_URL是vite中的环境变量
  // 可以在vite.config.js中配置base(相当于基地址)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/login',component:()=>import('@/view/login/LoginPage.vue')},
    {
      path:'/',
      component:()=>import('@/view/layout/LayoutContainer.vue'),
      redirect:'/article/manage',
      children:[
        {path:'/article/manage', component:()=>import('@/view/article/ArticleManage.vue')},
        {path:'/article/channel',component:()=>import('@/view/article/ArticleChannel.vue')},
        {path:'/user/profile',component:()=>import('@/view/user/UserProfile.vue')},
        {path:'/user/avatar',component:()=>import('@/view/user/UserAvatar.vue')},
        {path:'/user/password',component:()=>import('@/view/user/UserPassword.vue')},
      ]
    },

  ],
})

// 登录访问拦截----->导航守卫  默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值
// 1. undefined、true直接放行
// 2、fasle拦回from地址页面
// 3、具体路径 或 路径对象 拦截到对应的地址
// '/login', {name:'login'}
router.beforeEach((to)=>{
  // 如果没有token,且非登录页 拦截到登录 其它放行
  const useStore = useUserStore()
  if(!useStore.token && to.path !== '/login') return '/login'
  return true
})


export default router
