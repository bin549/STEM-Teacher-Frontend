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
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/course',
    component: Layout,
    redirect: "/course/media",
    name: "Course",
    alwaysShow: true,
    meta: {
        title: "课程",
        icon: "education",
        roles: ['admin', 'editor']
    },
    children: [{
        path: "column",
        name: "Column",
        component: () =>
            import('@/views/course/column'),
        meta: {
            title: "专栏"
        }
    }, {
        hidden: true,
        path: "column_detail",
        name: "ColumnDetail",
        component: () =>
            import('@/views/course/column_detail'),
        meta: {
            title: "专栏详情"
        }
    },
        {
        path: "media",
        name: "Media",
        component: () =>
            import('@/views/course/media'),
        meta: {
            title: "图文"
        }
    },
    {
        path: "video",
        name: "Video",
        component: () =>
            import('@/views/course/video'),
        meta: {
            title: "视频"
        }
    }, ]
  },


    {
      path: '/activity',
      component: Layout,
      redirect: "/activity/assignment",
      name: "education",
      alwaysShow: true,
      meta: {
          title: "活动",
          icon: "excel",
          roles: ['admin', 'editor']
      },
      children: [{
          path: "assignment",
          name: "Activity",
          component: () =>
              import('@/views/activity/assignment'),
          meta: {
              title: "活动"
          }
      }, {
          hidden: true,
          path: "execution",
          name: "Execution",
          component: () =>
                import('@/views/activity/execution'),
          meta: {
              title: "执行情况"
          }
      },{
          path: "center",
          name: "Center",
          component: () =>
                import('@/views/activity/center'),
          meta: {
              title: "展示中心"
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
              component: () => import('@/views/student/index'),
              name: 'Student',
              meta: { title: '学生', icon: 'peoples', noCache: true }
            }
          ]
        },
      {
        path: '/notifications',
        component: Layout,
        children: [
          {
            path: 'index',
            component: () => import('@/views/notifications/index'),
            name: 'Notifications',
            meta: { title: '公告', icon: 'icon', noCache: true }
          }
        ]
      },


  {
    path: '/icon',
    component: Layout,
    children: [
      {
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
