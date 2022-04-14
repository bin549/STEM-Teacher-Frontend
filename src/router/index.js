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
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
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
        icon: "excel",
        roles: ['admin', 'editor']
    },
    children: [{
        path: "media",
        name: "Media",
        component: () =>
            import('@/views/course/media'),
        meta: {
            title: "图文"
        }
    }, {
        path: "audio",
        name: "Audio",
        component: () =>
            import('@/views/course/audio'),
        meta: {
            title: "音频"
        }
    }, {
        path: "video",
        name: "Video",
        component: () =>
            import('@/views/course/video'),
        meta: {
            title: "视频"
        }
    }, {
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
    }]
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
