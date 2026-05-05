# 🏋️ 健身 App - 多角色开发指南

## 快速开始

```bash
cd ~/projects/fitness-app
```

## 角色分工

| 角色 | 负责 | 命令 |
|------|------|------|
| 🎨 **产品经理** | 需求分析、功能规划 | `./dev fe pm "..."` |
| 🖥️ **前端** | UI、组件、交互 | `./dev fe frontend "..."` |
| 🔧 **后端** | API、数据模型、业务逻辑 | `./dev fe backend "..."` |
| 🧪 **测试** | 单元测试、集成测试 | `./dev fe test "..."` |
| 👁️ **审核** | Code Review、合并 | `./dev fe review "..."` |

## 常用工作流

### 开发一个新功能（完整流水线）

```bash
# 1. 产品经理出需求
./dev fe pm "设计一个'历史记录'页面功能，需求文档写到 docs/"

# 2. 前端开发
./dev fe frontend "读取 docs/ 的需求文档，实现历史记录页面"

# 3. 后端开发（并行）
./dev fe backend "读取 docs/ 的需求文档，实现历史记录 API"

# 4. 测试（等前两个完成后）
./dev fe test "读取新代码，编写测试用例"

# 5. 审核
./dev fe review "审核最近 5 个 commits"
```

### 一键全局分析

```bash
./dev analysis
```
