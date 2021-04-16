import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

/*function RoleNav(){
  let code = store.getters.userInfo.RoleCode
    console.log(store.getters.userInfo.Account, code)
    if(code != '00000000-0000-0000-0000-000000000000'){
}*/
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    //name: 'Home',
    //meta: { title: 'Home', icon: 'home' },
    redirect: '/dashboard',
    children: [/*{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/admin/index'),
      meta: { title: 'Home', icon: 'home' }
    },*/
    {
      //path: '/dashboard/admin/index_',
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/admin/index_'),
      meta: { title: 'Home', icon: 'home' }
    }]
  },
  {
    path: '/sim-manage',
    component: Layout,
    redirect: '/',
    name: 'SIM Manage',
    meta: { title: 'SIM Manage', icon: 'sim-manage' },
    children: [
      {
        path: 'sim-list',
        name: 'SimList',
        component: () => import('@/views/sim-manage/sim-list'),
        meta: { title: 'SIM List', icon: 'sim' },
      },/*{
        path: 'sim-list_',
        name: 'SimList_',
        component: () => import('@/views/sim-manage/sim-list_'),
        meta: { title: 'SIM List_', icon: 'sim' },
      },*/{
        path: '/sim-list/:id', 
        name: 'SIM Profile',
        component: () => import('@/views/sim-manage/sim-profile'),
        meta: { title: 'SIM Profile', child: true, icon: 'sim' },
        hidden: true
      }/*,{
        path: 'commands',
        name: 'Commands',
        component: () => import('@/views/sim-manage/commands'),
        meta: { title: 'Commands', icon: 'terminal' }
      }*/
    ]
  },
  {
    path: '/customer-manage',
    component: Layout,
    redirect: '/',
    name: 'Customer Manage',
    meta: { title: 'Customer Manage', icon: 'customer-manage' },
    children: [
      {
        path: 'user-list',
        name: 'User List',
        component: () => import('@/views/customer-manage/user-list'),
        meta: { title: 'User List', icon: 'customer-manage' },
      },
      {
        path: 'customer-list', 
        name: 'Customer List',
        component: () => import('@/views/customer-manage/customer-list'),
        meta: { title: 'Customer List', icon: 'history' },
      },
      {
        path: 'role permission',
        name: 'Role permission',
        component: () => import('@/views/customer-manage/role'),
        meta: { title: 'Role permission', icon: 'nested' }
      },
      {
        path: 'role managment',
        name: 'Role managment',
        component: () => import('@/views/customer-manage/role-managment'),
        meta: { title: 'Role managment', icon: 'lock' }
      },
    ]
  },
  /*{
    path: '/customer',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Customer manage',
        component: () => import('@/views/customer/index'),
        meta: { title: 'Customer manage', icon: 'customer-manage' },
      }
    ]
  },*/
  {
    path: '/history',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'History',
        component: () => import('@/views/history/index'),
        meta: { title: 'History', icon: 'history' },
      }
    ]
  },
  {
    path: '/sms',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'SMS',
        component: () => import('@/views/sms/index'),
        meta: { title: 'SMS', imsi: '', icon: 'sms' },
      }
    ]
  },

  {
    path: '/report',
    component: Layout,
    redirect: '/',
    name: 'Reports',
    meta: { title: 'Reports', icon: 'reports' },
    children: [
      {
        path: 'quikdata-imns',
        name: 'QuikData IMNS',
        component: () => import('@/views/report/quikdata-imns'),
        meta: { title: 'QuikData IMNS', icon: 'reports' }
      },
      /*{
        path: 'imns-activity',
        name: 'IMNS Activity',
        component: () => import('@/views/report/imns-activity'),
        meta: { title: 'IMNS Activity', icon: 'reports' }
      },
      {
        path: 'sms-activity',
        name: 'SMS Activity',
        component: () => import('@/views/report/sms-activity'),
        meta: { title: 'SMS Activity', icon: 'reports' }
      }*/
    ]
  },

  {
    path: '/commands',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Commands',
        component: () => import('@/views/commands/index'),
        meta: { title: 'Commands', icon: 'commands' },
      }
    ]
  },

  {
    path: '/csp',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CSP Manage',
        component: () => import('@/views/csp/index'),
        meta: { title: 'CSP Manage', icon: 'csp' },
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  /*{
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
