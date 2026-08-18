# Agent Harness 开发说明

> 本文描述一套**可落地的 Agent Harness 目标架构**开发规范。  
> 设计吸取 DeepSeek Harness（dsh）的优点（Session Log 不变量、Capability Seam、Host/Client 双半插件），并刻意收敛其扩展路径碎片化问题。  
> 状态：设计规范（Implementation Spec）。实现时以本文为准；与 dsh 源码冲突时，以本文为目标态，dsh 仅作参考。

---

## 1. 文档目的与读者

| 读者 | 用途 |
|------|------|
| 架构 / 核心开发 | 内核边界、不变量、模块职责 |
| 插件作者 | 如何写、装、测一个 Plugin |
| 产品 / 部署 | Profile 裁剪、安全默认、发布流程 |
| Agent（编码助手） | 按本文目录与约定改代码，不另发明扩展宇宙 |

**非目标**：复刻 dsh 全部包名与 Cordis 细节；本文定义的是更小、更一致的产品架构。

---

## 2. 设计原则

1. **一种扩展形态**：只有 Plugin；没有「内存动态包 / 正式 bundle / patch / preset」四套并行宇宙。
2. **Session Log 是真相源**：凡进入模型请求的内容，必须能从日志重建（**模型可见 ⟺ 已记录**）。
3. **内核要小**：Loop + Log + Tools + 少量 Capability 接口；goal / plan / subagent / 搜索等均为可选官方插件。
4. **实验可落盘、可晋升**：允许 scratch 实验目录，禁止「仅内存、重启即无且无法晋升」作为产品主路径。
5. **Host / Client 分端加载、同包分发**：一个 npm 包两入口；花名册写一次。
6. **安全靠默认策略 + 诚实标注**：Sandbox 若 partial 就写 partial；高权限能力默认关闭。

---

## 3. 总体架构

```text
┌─────────────────────────────────────────────────────────┐
│  Surfaces：CLI / Web Shell / SDK / ACP（可选）            │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Host Gateway                                            │
│  - 唯一 /api（一种 Remote 描述）                          │
│  - 可选静态资源 + client 模块下发                         │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Runtime Kernel（固定、小）                               │
│  SessionLog │ AgentLoop │ ToolRuntime │ Capability Bus   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Plugins（唯一扩展单元）                                  │
│  llm / fs / shell / sandbox / web-ui / subagent / …      │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Profile：启用列表 + 配置覆盖                             │
│  Scratch → Promote → 正式依赖                            │
└─────────────────────────────────────────────────────────┘
```

### 3.1 与 dsh 概念对照（迁移心智）

| dsh | 本文 |
|-----|------|
| Cordis 插件树 + bundle + patch + 动态包 | **Plugin + Profile** |
| `cordis_define` 内存包 | **Scratch 插件目录**（可 promote） |
| `dsh plugin add` | 同左，唯一长期安装路径 |
| agent preset | Profile 内的 **AgentPreset** 配置（引用已装 Plugin，不另搞安装） |
| ApiProxy + Typert 双栈 | **一种 Remote** |
| Session JSONL + 多套 sqlite 叙事 | **一种主 SessionStore** + 可重建派生索引 |

---

## 4. 仓库与目录约定

建议 monorepo：

```text
apps/
  cli/                 # dsh 等价 CLI
  web/                 # Web 入口（薄壳）
packages/
  kernel/
    session-log/       # 事件日志、surface、deriveMessages
    agent-loop/        # turn/step 驱动
    tools/             # 工具注册与执行管线
    capabilities/      # llm/fs/shell/sandbox 接口定义
    gateway/           # /api Remote 网关
  plugins/
    llm-openai-compat/
    fs-local/
    shell-local/
    sandbox-os/
    web-ui-shell/      # layout/slots 等
    web-ui-conversation/
    subagent-inprocess/
    session-search/    # 可选 FTS
    …
  client-runtime/      # 浏览器对象层（无 React）
  client-connection/   # /api + 事件流
profiles/
  coding/              # 默认瘦 profile 模板
  full/                # 可选全家桶
docs/                  # 本说明与子系统文档
```

包命名建议：`@org/ah-<area>-<name>`（示例前缀 `ah` = agent harness）。实现时可替换 scope。

---

## 5. Runtime Kernel 详述

### 5.1 SessionLog

**职责**

- Append-only 事件流 + SessionHeader
- Surface 投影：`user/message` / `assistant/message` / `tool/result` → `deriveMessages()`
- Fork / resume / 导出均派生自此流

**硬性不变量**

1. 进入模型请求的 messages / system / tools，必须可由某一日志前缀重建。
2. 新增模型可见输入 ⇒ 新增事件类型（或扩展已有 map），禁止「只改内存 prompt」。
3. UI 装饰数据不得冒充模型可见内容写入 log；展示由 client 按帧重算。

**建议事件族（最小集）**

- 边界：`turn/start` `turn/end` `step/start` `step/end`
- 消息：`user/message` `assistant/chunk` `assistant/message` `tool/call` `tool/result`
- 请求锚：`request/header` `request/context`
- 控制：`agent/inbox/spliced`（若保留持久队列）

格式版本：单调整数；不兼容则拒绝加载（预览期可无迁移）。

### 5.2 AgentLoop

**概念**

- **Step**：一次模型请求 + 其工具调用
- **Turn**：零或多个 Step；领取输入后打开，工作结清后关闭

**对外产品语义（仅两个）**

| 概念 | 含义 | 实现提示 |
|------|------|----------|
| `queue` | 排队，随后按 FIFO 开新 Turn | 原 next-turn / followup |
| `steer` | 插入当前 Turn 的下一 Step | 原 next-step 用户引导 |

系统注入（审批结果、job 完成通知等）走内部 `inject`，**不**作为第三套用户 API。

**最小拦截点（瀑布须 `next()`）**

1. `agent/pre-step` — 改写/拒绝本步可见输入  
2. `agent/request` — 调整 provider/model/config  
3. `llm/stream` — 流式调用包装（重试/录制）  
4. `tools/pre-execute` → `tools/execute` → `tools/post-execute`

Turn 结束前可串行 `agent/turn-stopping`（无 next）。

**取消**

- `cancel` 默认清空 queue；可选 `keepInbox`
- abort 后须达到完全停稳再开下一 Turn

### 5.3 ToolRuntime

- 工具定义：name、description、JSON Schema、execute、可选 presentation
- 执行模式：exclusive / parallel（有界并发）
- 审批：ask / never / 策略表；缺审批能力时 ask→拒绝
- 结果必须可序列化进 log

### 5.4 Capability Bus

每个能力 = **接口定义 + 可注册 Provider + 可选 Consumer（常为 Tool）**。

| Capability | 典型 Provider | 典型 Consumer |
|------------|---------------|---------------|
| `llm` | openai-compat / deepseek / … | AgentLoop |
| `fs` | local / remote-sandbox | tool-fs |
| `shell` | local / e2b | tool-bash |
| `sandbox` | landlock / bwrap / seatbelt / none | shell 包装 |

规则：换 Provider 不应改 Tool 名与 schema（除非刻意发大版本）。

---

## 6. Plugin 系统（唯一扩展路径）

### 6.1 清单（package.json）

```json
{
  "name": "@org/ah-plugin-example",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js"
  },
  "ah": {
    "contributes": {
      "tools": true,
      "remotes": ["example/ping"],
      "routes": [{ "kind": "prefix", "path": "/example" }],
      "uiSlots": ["settings.example"],
      "capabilities": ["fs"]
    },
    "client": {
      "platform": "web",
      "inject": ["@org/ah-client-runtime"]
    }
  }
}
```

- 无 `./client` 则纯 Host 插件合法。  
- `contributes` 是装载依据；禁止再维护第二套「只有 yaml patch 才算插件」的隐式规则。

### 6.2 Host 半约定

```ts
// host 入口：导出 apply / inject（或框架等价物）
export const inject = ['tools', 'llm']
export function apply(ctx: KernelContext, config: Config) {
  ctx.tools.register(defineTool({ /* … */ }))
  // 可选：ctx.remotes / ctx.httpRoutes / ctx.capabilities.registerProvider
}
```

要求：

- 注册必须挂在当前 fiber/生命周期上，卸载即撤销  
- 禁止在插件里偷偷改全局单例且无 disposer  
- 配置用 schema 校验；覆盖为**整段替换**或明确深合并策略（二选一写死）

### 6.3 Client 半约定

- 仅通过 **Slot** 组合 UI：`slots.register({ name, children? }, Component)`  
- 组件不接触 `ctx`；数据经 props / store / 框架 hooks  
- 业务状态在 `client-runtime` 对象层；store 仅视图态  

### 6.4 构建与消费

```text
pnpm build
  → lib/index.js     （Node 加载）
  → lib/client.js    （浏览器模块表 / /plugins/<id>）

Profile 启用该包一次
  → Host Cordis/Loader import "."
  → modules 扫描 ah.client → 下发 ./client
```

**不是**把后端打进浏览器执行；是同包分发、分端加载。

### 6.5 HTTP 路由插件化

- Kernel 提供空 `httpServer.register({ kind, path, handler })`  
- `/api` 由 gateway 插件挂载  
- 业务优先 **Remote 方法**，少开新 path  
- 静态 SPA 占唯一 fallback

---

## 7. Profile、Scratch、Promote

### 7.1 Profile

目录示例：`$AH_HOME/profiles/<name>/`

```text
package.json          # dependencies + ah.profile.plugins 有序列表
config.yaml           # 配置覆盖（替代漫天 patch 文件亦可）
```

启动组合顺序：

1. Kernel 固定行  
2. Profile 插件列表（安装顺序）  
3. Profile config 覆盖  
4. CLI `--config` 覆盖（最高）

### 7.2 Scratch（取代内存动态包）

路径：`$AH_HOME/profiles/<name>/scratch/<pluginId>/`

- 由 Agent 或开发者生成**完整插件骨架**（含 package.json 与 host/client）  
- 仅当前 profile 可见；可 `ah scratch run <id>` 热加载  
- 重启后**仍在磁盘**（与 dsh 内存包不同）  
- 默认关闭：需 `features.scratch: true`

### 7.3 Promote

```bash
ah plugin promote scratch/<id> --name @org/ah-plugin-foo
# 校验 build/test → 写入 profile dependencies → 移出 scratch（或标记 promoted）
```

无「内存包一键变正式包」；有「scratch 目录一键变正式依赖」。

### 7.4 AgentPreset（可选）

- 不是安装通道  
- 描述：启用哪些已装工具子集、persona 文案、权限档  
- 会话 header 记录 preset id，resume 必须重建同一工具面  

---

## 8. Host ↔ Client 数据面

### 8.1 connection

- Unary：`POST /api/<namespace>/<method>`  
- Downlink：WebSocket 或等价推送（mux / host）  
- 信任栅栏：默认回环；非回环必须显式 trustedHosts（预览期可不做完整账号体系）

### 8.2 client-runtime

- Session / Workspace 列表与对象  
- 事件窗口 → Conversation Node 组装  
- queue 投影（仅 queue；steer 另通道或内嵌当前会话）  
- 无 React；UI 插件只读快照  

分层红线：

```text
UI 组件 → runtime 对象层 → connection → Host
```

---

## 9. 存储

### 9.1 主存：SessionStore

部署选定一种：

- **jsonl**（默认，易 diff / 易测评），或  
- **sqlite**（单文件、便于查询）

禁止默认同写两套真相源。

### 9.2 派生索引

- FTS / 列表投影缓存：可删可重建  
- 不得与主库共用 path 却假装一体  

### 9.3 领域 KV

Workspace 顺序等元数据走统一 `storage` 插件；Provider 可为 json 或 sqlite，由配置选择。

---

## 10. 官方插件职责（建议默认集）

### 10.1 默认 Profile：`coding`

| 插件 | 作用 |
|------|------|
| llm provider | 模型调用 |
| fs + shell | 读写与命令 |
| sandbox | workspace-write + ask |
| web-ui（可选） | 浏览器壳 + conversation |
| agent-instructions | AGENTS.md 等 |

### 10.2 可选

| 插件 | 作用 |
|------|------|
| subagent-inprocess | spawn / fork 委派 |
| plan / goal | 计划与目标 |
| session-search | 全文搜索 |
| container-sidecar | 可选第三运行时：容器内长跑服务（观测用） |
| telemetry | 默认关 |

### 10.3 Subagent（若启用）行为摘要

```text
模型 tool → subagents.start(provider)
  → 子 Session + 子 Loop
  → one-shot 返回结果 | continuable 可 followup/report
```

策略：继承沙箱边界；子审批默认 never；深度写入 header。

---

## 11. 可选：Container Sidecar（第三运行时）

若产品需要「插件自开容器供观测」：

**不要**做成动态包第三半魔法；做成 Plugin `contributes.runtimes: ["container"]`：

1. 声明镜像或 build 上下文  
2. 生命周期绑定插件启停（stop/unload 必须停容器）  
3. 端口仅绑定回环或受控网络  
4. 日志/指标回流到 Session 事件或 Host Remote  
5. 默认关闭；开启≈高信任

---

## 12. 安全基线

| 项 | 要求 |
|----|------|
| 默认权限 | workspace-write + ask |
| Scratch | 默认关 |
| 插件安装 | 钉版本/commit；git prepare 需显式 allowBuilds |
| 凭证 | 不进模型可见 log；子进程环境 scrub `*KEY*`/`*SECRET*` 等 |
| Sandbox | 报告 full/partial；不可用则 fail-closed 或明确 danger 档 |
| 远程 Web | 无认证前不建议 `0.0.0.0` 裸奔 |

---

## 13. 开发工作流

### 13.1 环境

- Node：与实现选定的 LTS 对齐（建议 ≥ 22）  
- 包管理：pnpm workspace  
- 语言：TypeScript strict  

### 13.2 常用命令（示意）

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm ah --profile coding
pnpm ah --profile coding --dump-config
pnpm ah plugin add ./packages/plugins/foo
pnpm ah scratch create demo
pnpm ah plugin promote scratch/demo
```

### 13.3 新增官方插件 Checklist

1. 建包：`packages/plugins/<name>`，写 `ah.contributes`  
2. 实现 host；需要 UI 则加 `./client` + slot 注册  
3. 单测：注册/卸载对称、工具 schema、权限拒绝路径  
4. 若模型可见：补事件类型与「从 log 重建」测试  
5. 挂到某个 profile 模板（默认或 optional）  
6. 更新子系统文档与工具目录（若有生成器则跑生成）  

### 13.4 修改 AgentLoop Checklist

1. 先更新本文与 `docs/subsystems/agent-loop.md`  
2. 保持模型可见 ⟺ 已记录  
3. 取消路径必须完全停稳  
4. 补回归：steer/queue、工具并行、max-tokens、abort  

### 13.5 禁止事项

- 新增第四种扩展通道（又一种「临时 mount」）  
- UI 组件直接 import 另一 UI 插件实现  
- 把展示用结构写入 SessionLog 冒充历史  
- 在无 disposer 的情况下注册全局 hook  

---

## 14. 测试策略

| 层级 | 内容 |
|------|------|
| 单元 | schema、纯函数、inbox queue/steer、surface fold |
| 组件/插件 | 装载卸载、工具执行、Remote 契约 |
| 回放 | 固定 session 日志 → 期望模型可见 messages / tool schemas |
| e2e | 真实或 mock LLM；无 key 则 skip |
| 契约 | contributes 与实际注册一致；client 包必须有 `./client` 产物 |

覆盖率：对 kernel 建议高门槛；插件按风险定。

---

## 15. 版本与兼容

- Kernel 与 Plugin 约定用 semver  
- Session 格式版本单调；预览期可不提供迁移  
- Remote 字段删除走弃用窗口；生成客户端与 Host 同 PR 更新  

---

## 16. 里程碑建议

### M0 — 可跑最小环

- SessionLog（jsonl）+ AgentLoop + ToolRuntime  
- 一个 llm provider + fs/shell（可先无强沙箱）  
- CLI headless：「一问一答 + 工具」  

### M1 — 可装插件

- Plugin 装载 + Profile  
- Scratch + Promote  
- `--dump-config`  

### M2 — Web

- Gateway `/api` + connection + client-runtime  
- ui-shell + conversation + tool 卡片  
- queue / steer UI  

### M3 — 加固

- Sandbox + 审批  
- Subagent 可选  
- Session search 可选  
- 回放测评流水线  

### M4 — 可选容器 sidecar

- contributes.runtime container  
- 生命周期与观测回流  

---

## 17. 验收标准（架构级）

1. 新贡献者只学习 **Plugin + Profile** 即可扩展，无需理解「四条路」。  
2. 任意模型可见请求可从 SessionLog 重建；有自动化测试钉住。  
3. 卸载插件后工具/路由/UI slot 全部消失（无泄漏）。  
4. 默认 coding profile 包数量与概念远小于「全家桶」；可选能力显式安装。  
5. Scratch 重启仍在；Promote 后成为普通依赖。  

---

## 18. 附录：最小 Turn 时序

```text
queue 消息唤醒
  turn/start
    claim(queue 一项 + 本步 steer/inject)
    pre-step → 组装 prompt/tools
    step/start
      写 user/message*
      deriveMessages → request → llm/stream
      assistant/chunk* → assistant/message
      tool/call* → tools 管线 → tool/result*
    step/end
    若仍欠工具续跑或有 steer → 下一步
  turn-stopping
  turn/end
若 queue 仍有 → 下一 turn
```

---

## 19. 附录：名词表

| 名词 | 含义 |
|------|------|
| Kernel | 固定运行时，不含可选业务插件 |
| Plugin | 唯一扩展单元（host ± client） |
| Profile | 插件启用列表 + 配置 |
| Scratch | 可落盘实验插件目录 |
| Promote | Scratch → 正式依赖 |
| SessionLog | 会话事件真相源 |
| Capability | 可换后端的能力接口 |
| Remote | /api 上的类型化 RPC 方法 |
| Slot | 浏览器 UI 组合孔位 |
| queue / steer | 唯一对外输入产品语义 |

---

## 20. 文档维护

- 架构变更先改本文，再改代码  
- 子系统细节可拆 `docs/subsystems/*.md`，但不得与本文冲突  
- 实现若偏离本文，须在 PR 中更新本文并说明原因  

---

*文档版本：0.1（设计稿）*  
*对应讨论背景：DeepSeek Harness 源码分析后的收敛重设计*
