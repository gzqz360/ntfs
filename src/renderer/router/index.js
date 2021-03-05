import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      component: require('@/view/PageOne').default,
      redirect:'/home',
      children:[
        {
          path: '/home',
          name: 'home',
          component: require('@/view/Home').default,
        },
        {
          path: '/index',
          name: 'index',
          component: require('@/view/Index').default,
          // redirect:'/info',
          // children:[
          //   {
          //     path: '/info',
          //     name: 'info',
          //     component: require('@/view/Info').default,
          //   },
          //   {
          //     path: '/format',
          //     name: 'format',
          //     component: require('@/view/Format').default,
          //   },
          //   {
          //     path: '/repair',
          //     name: 'repair',
          //     component: require('@/view/Repair').default,
          //   }
          // ]
        },
        {
          path: '/disk',
          name: 'disk',
          component: require('@/view/Disk').default,
        },
        {
          path: '/setting',
          name: 'setting',
          component: require('@/view/Setting').default,
        }
      ]
    },
  ],
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

