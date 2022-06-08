import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
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
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/course',
    component: Layout,
    children: [
      {
        path: "column",
        name: "Column",
        component: () =>
          import('@/views/course/column'),
        meta: { title: '课程管理', icon: 'education', noCache: true }
      },
      {
        hidden: true,
        path: "lecture",
        name: "Lecture",
        component: () =>
          import('@/views/course/lecture'),
        meta: {
          title: "课时管理"
        }
      },
    ]
  },
  {
    path: '/activity',
    component: Layout,
    children: [{
      path: "assignment",
      name: "Activity",
      component: () =>
        import('@/views/activity/assignment'),
      meta: { title: '活动管理', icon: 'form', noCache: true }
    }, {
      hidden: true,
      path: "execution",
      name: "Execution",
      component: () =>
        import('@/views/activity/execution'),
      meta: {
        title: "执行情况"
      }
    },
    ]
  },
  {
    path: '/student',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Student',
        component: () => import('@/views/student/index'),
        meta: { title: '学生管理', icon: 'peoples', noCache: true }
      }
    ]
  },
  {
    path: '/center',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Center',
        component: () => import('@/views/center/index'),
        meta: { title: '展示中心', icon: 'tab', noCache: true }
      }
    ]
  },
  // {
  //   path: '/notifications',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/notifications/index'),
  //       name: 'Notifications',
  //       meta: { title: '公告', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        hidden: true,
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
