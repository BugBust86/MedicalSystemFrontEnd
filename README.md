# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此仓库中处理代码时提供指导。

## 项目概述

MedicalSystemFrontEnd 是一个使用 Vue 3 + TypeScript 的医疗管理系统前端，使用 Vite 作为构建工具。它与运行在 `localhost:8080` 的后端 API 集成。

## 技术栈

- **框架**: Vue 3 (使用 `<script setup>` 的组合式 API)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 库**: Element Plus
- **HTTP 客户端**: Axios
- **路由**: Vue Router 5
- **图标**: Font Awesome

## 可用命令

```bash
# 启动开发服务器，支持热重载
npm run dev

# 类型检查、编译并压缩生产版本
npm run build

# 在本地预览生产构建
npm run preview

# 运行代码检查 (ESLint + oxlint)
npm run lint

# 使用 Prettier 格式化代码
npm run format
```

## 代码架构

### 目录结构

```
src/
├── api/          # API 服务函数 (例如 staff.ts)
├── utils/        # 工具类 (request.ts - axios 封装)
├── views/        # 页面组件 (按角色分目录: admin/, doctor/, labTech/)
├── router/       # Vue Router 配置
├── App.vue       # 根组件
└── main.ts       # 入口点
```

### 路径别名

`@` 别名映射到 `src/` (在 `vite.config.ts` 中配置)。

### 角色路由

系统支持三种用户角色，通过路由进行区分：
- `/` - 登录页 (loginRegister.vue)
- `/doctor` - 医生页面 (子路由: duty-info, appointment, prescription, profile)
- `/admin` - 管理员页面
- `/lab-technician` - 化验员页面
- `/unauthorized` - 无权限页面

路由守卫实现基于角色的访问控制：
- `meta.requiresAuth` - 需要登录认证
- `meta.allowedRoles` - 允许访问的角色数组
- 登录成功后根据用户角色自动跳转到对应页面

### HTTP 请求层

`src/utils/request.ts` 提供预配置的 axios 实例，包括：

- 请求拦截器：从 localStorage 添加 JWT 令牌到 Authorization 头部 (`Bearer ${token}`)
- 响应拦截器：处理 `code === 0` 作为成功的 API 响应，管理 401/403/404/500 错误
- 401 错误时自动清除 token 并跳转到登录页
- 方法：`get`, `post`, `put`, `patch`, `delete`

### API 服务

`src/api/staff.ts` 提供员工认证接口：
- `staffRegisterService` - 员工注册
- `staffLoginService` - 员工登录

`src/api/doctor.ts` 提供医生相关接口：
- `getDutyInfoService` - 获取值班表

### 环境变量

- `.env.development`: `VITE_API_BASE_URL` = `http://localhost:8080`

## 关键模式

- Vue 组件使用 `<script setup lang="ts">`
- Element Plus 组件在 `main.ts` 中全局注册
- API 调用使用 `src/utils/request.ts` 中的请求封装
- 路由在 `src/router/index.ts` 中定义，使用动态导入实现按需加载
- 登录成功后 JWT token 存储在 localStorage
