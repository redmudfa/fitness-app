# 🏋️ Fitness Tracker — 个人健身追踪应用

记录跑步和力量训练数据，提供统计分析看板。**全栈单用户健身数据管理工具。**

## 功能

- **🏃 跑步记录** — 记录距离、时长、自动计算配速
- **💪 力量训练** — 记录动作、组数、次数、重量，自动计算训练容量
- **📊 数据看板** — 总跑量、总训练次数、总容量一览
- **🗄️ 本地存储** — SQLite 单文件数据库，零配置，数据完全由你掌控

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | HTML5 + CSS3 + Vanilla JS（SPA） |
| 后端 | Node.js + Express |
| 数据库 | SQLite (better-sqlite3) |
| 运行时 | Node.js 18+ |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 初始化示例数据（可选）
npm run seed

# 3. 启动服务
npm start
```

打开浏览器访问 **http://localhost:3000**

## 项目结构

```
fitness-app/
├── server/
│   ├── index.js      # Express 服务 + REST API
│   ├── db.js         # SQLite 数据库初始化 & Schema
│   └── seed.js       # 示例数据填充
├── public/
│   └── index.html    # 前端 SPA（内联 CSS + JS）
├── docs/
│   └── project-plan.md  # 完整项目规划文档
├── package.json
└── README.md
```

## API 接口

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/runs` | 获取跑步记录列表 |
| POST | `/api/runs` | 新增跑步记录 |
| DELETE | `/api/runs/:id` | 删除跑步记录 |
| GET | `/api/runs/stats` | 跑步统计数据 |
| GET | `/api/workouts` | 获取训练记录列表 |
| POST | `/api/workouts` | 新增训练记录 |
| DELETE | `/api/workouts/:id` | 删除训练记录 |
| GET | `/api/workouts/stats` | 训练统计数据 |
| GET | `/api/exercises` | 获取动作库 |
| GET | `/api/summary` | 首页汇总数据 |

## License

MIT
