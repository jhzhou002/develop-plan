# 开发计划管理系统

一个简约高级的开发计划记录和管理网站，帮助你更好地管理产品想法和开发计划。

## 🚀 功能特点

- **项目管理**: 创建、编辑、删除开发项目
- **状态跟踪**: 支持想法、规划中、开发中、测试中、已完成、暂停等状态
- **优先级管理**: 低、中、高、紧急四个优先级别
- **进度跟踪**: 可视化进度条显示项目完成度
- **技术栈标记**: 记录项目使用的技术栈
- **分类管理**: 按项目类型进行分类
- **标签系统**: 灵活的标签管理
- **筛选搜索**: 支持按状态、优先级、分类筛选
- **响应式设计**: 适配各种设备屏幕

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Element Plus** - Vue 3组件库
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Axios** - HTTP客户端
- **Vite** - 构建工具

### 后端
- **Node.js** - JavaScript运行环境
- **Express** - Web应用框架
- **MySQL** - 关系型数据库
- **mysql2** - MySQL驱动

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

## 📦 安装部署

### 环境要求
- Node.js >= 16.0.0
- MySQL >= 5.7
- npm >= 7.0.0

### 1. 克隆项目
```bash
git clone https://github.com/jhzhou002/develop-plan.git
cd develop-plan
```

### 2. 数据库配置

首先创建数据库并导入表结构：

```bash
# 登录MySQL
mysql -u root -p

# 执行数据库脚本
source database/schema.sql
```

### 3. 后端部署

```bash
cd backend
npm install
npm start
```

后端服务将在 `http://localhost:3001` 启动

### 4. 前端部署

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

## 🗃️ 数据库设计

### 主要数据表

- **projects**: 项目主表
- **tasks**: 任务表
- **tags**: 标签表
- **project_tags**: 项目标签关联表
- **notes**: 笔记表

### 数据库配置

项目使用的数据库配置位于 `backend/src/config/database.js`:

```javascript
const DB_CONFIG = {
  host: '8.153.77.15',
  user: 'connect',
  password: 'Zhjh0704.',
  database: 'develop-plan',
  port: 3306,
  charset: 'utf8mb4',
  timezone: '+08:00'
};
```

## 📁 项目结构

```
develop-plan/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   └── app.js         # 入口文件
│   └── package.json
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # 状态管理
│   │   ├── utils/         # 工具函数
│   │   ├── router/        # 路由配置
│   │   └── main.js        # 入口文件
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/               # 数据库脚本
│   └── schema.sql
└── README.md
```

## 🔧 开发指南

### 本地开发

1. 启动后端开发服务器:
```bash
cd backend
npm run dev
```

2. 启动前端开发服务器:
```bash
cd frontend
npm run dev
```

### API接口

#### 项目相关接口
- `GET /api/projects` - 获取项目列表
- `GET /api/projects/:id` - 获取项目详情
- `POST /api/projects` - 创建项目
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

#### 任务相关接口
- `GET /api/tasks/project/:projectId` - 获取项目任务列表
- `POST /api/tasks/project/:projectId` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 构建部署

#### 前端构建
```bash
cd frontend
npm run build
```

#### 生产环境启动
```bash
cd backend
npm start
```

## 🎨 设计理念

项目采用简约高级的设计风格：

- **色彩**: 使用渐变背景和半透明卡片设计
- **布局**: 响应式网格布局，适配各种屏幕尺寸
- **交互**: 流畅的动画过渡和hover效果
- **视觉**: 毛玻璃效果和阴影提升视觉层次

## 📝 更新日志

### v1.0.0 (2025-01-26)
- ✨ 项目初始版本
- ✨ 基础项目管理功能
- ✨ 状态和优先级管理
- ✨ 技术栈和标签系统
- ✨ 响应式UI设计

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

- **jhzhou002** - [GitHub](https://github.com/jhzhou002)
- **Email**: 318352733@qq.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！