import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  // 路由模式，使用 HTML5 的 history 模式，路径基于 BASE_URL 环境变量
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由关系配置，path 是路径，name 是路由名称，component 是组件，使用动态导入的方式按需加载组件
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/loginRegister.vue'), // 动态导入按需加载
    },
    {
      path: '/doctor',
      name: 'doctor',
      component: () => import('@/views/doctor/DoctorRoot.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['医生'],
      },
      redirect: '/doctor/duty-info', // 重定向到子路由，访问 /doctor 时，自动跳转到 /doctor/duty-info
      children: [
        // 医生子路由，路径相对于父路由 /doctor
        {
          path: 'duty-info',
          name: 'duty-info',
          component: () => import('@/views/doctor/child/DutyInfo.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'appointment',
          name: 'appointment',
          component: () => import('@/views/doctor/child/Appointment.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'prescription',
          name: 'prescription',
          component: () => import('@/views/doctor/child/Prescription.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/doctor/child/Profile.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminRoot.vue'),
      meta: { requiresAuth: true, allowedRoles: ['管理员'] },
    },
    {
      path: '/lab-technician',
      name: 'lab-technician',
      component: () => import('@/views/labTech/LabTechnicianRoot.vue'),
      meta: { requiresAuth: true, allowedRoles: ['化验员'] },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/unauthorized.vue'),
    },
  ],
})

// 添加全局前置守卫，to 是目标路由，from 是来源路由，next()放行
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 如果已登录且访问登录页，重定向到默认页面
  if (to.path === '/' && token) {
    const role = localStorage.getItem('role')
    if (role === '医生') {
      return next('/doctor')
    } else if (role === '管理员') {
      return next('/admin')
    } else if (role === '化验员') {
      return next('/lab-technician')
    } else {
      return next('/doctor') // 默认跳转到医生页面
    }
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !token) {
    ElMessage.warning('请先登录')
    return next({
      path: '/',
      query: { redirect: to.fullPath }, // 保存原始目标路径
    })
  }

  // 检查角色权限
  if (to.meta.allowedRoles && token) {
    const userRole = localStorage.getItem('role')
    const allowedRoles = to.meta.allowedRoles as string[]
    if (!userRole || !allowedRoles.includes(userRole)) {
      ElMessage.error('无权访问该页面')
      return next('/unauthorized')
    }
  }

  return next()
})

export default router
