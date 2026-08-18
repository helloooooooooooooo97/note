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
7. **全程测试驱动（TDD）**：每个 OOD（设计单元 / 模块）先测后码；涉及模型处默认走 **MockLLM**，真实 API 仅作可选 e2e。

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
## 13. 开发工作流（强制 TDD）

### 13.1 环境

- Node：与实现选定的 LTS 对齐（建议 ≥ 22）  
- 包管理：pnpm workspace  
- 语言：TypeScript strict  
- 测试：Vitest（或等价）；默认 **不依赖真实 LLM API Key**

### 13.2 常用命令（示意）

```bash
pnpm install
pnpm build
pnpm test                 # 全量；默认走 MockLLM，无外网 key
pnpm test packages/kernel/agent-loop   # 单包
pnpm test:watch
pnpm typecheck
pnpm ah --profile coding
pnpm ah --profile coding --dump-config
pnpm ah plugin add ./packages/plugins/foo
pnpm ah scratch create demo
pnpm ah plugin promote scratch/demo
# 可选：真实提供方 e2e（显式门禁）
AH_LIVE_LLM=1 DEEPSEEK_API_KEY=… pnpm test:e2e:live
```

### 13.3 TDD 循环（每个 OOD 强制）

**OOD** = 本文目录中的一个可交付设计单元（一个 package、一个清晰边界的类/服务、或一条 Capability Provider）。  
**规则：没有对应用例的 OOD 不得合并。**

对每一个 OOD，严格按：

```text
1. 写失败测试（Red）     ← 先定行为与契约
2. 写最小实现（Green）   ← 只为让测试通过
3. 重构（Refactor）      ← 保持测试绿
4. 提交                  ← 测试与实现同 PR
```

禁止：

- 先写完实现再补测「走过场」  
- 用真实 LLM 作为默认单测依赖  
- 合并「有代码、无对应 `*.spec.ts` / `*.test.ts`」的 kernel/plugin OOD  

### 13.4 OOD ↔ 测试映射（最低要求）

| OOD / 包 | 必须覆盖的测试 | MockLLM？ |
|----------|----------------|-----------|
| `session-log` | append、surface fold、deriveMessages、fork 边界、损坏拒绝 | 否 |
| `agent-loop` | queue/steer、turn/step、取消停稳、工具续跑、max-tokens、request/header 重建 | **是** |
| `tools` | 注册/卸载、schema 校验、pre/exec/post、并行/排他、审批拒绝 | 否（可假工具） |
| `capabilities/llm` 接口 | adapter 注册、无 adapter 错误、stream 契约 | **是** |
| 各 `llm-*` provider | 对 MockLLM 的请求形状、重试/断流行为 | **是** |
| `fs` / `shell` / `sandbox` | 权限边界、fail-closed、partial 报告 | 否 |
| `gateway` / Remote | 方法分发、参数校验、鉴权/回环 | 否 |
| 每个 Plugin | contributes 装载、卸载对称、至少 1 条主路径行为 | 若调用模型则 **是** |
| `client-runtime` | 列表基线、事件折叠、queue 投影 | 可用 fixture 帧，不必真连 |
| `client-connection` | RPC 编解码、重连 generation（可用假 HTTP） | 否 |
| UI Plugin | slot 注册、关键交互（组件测）；不测像素 | 否 |

每个 OOD 目录约定：

```text
packages/<area>/<ood>/
  src/
  tests/
    <ood>.spec.ts          # 行为主测（必有）
    invariant.spec.ts      # 若有不变量伴侣
    *.reconstruction.spec.ts  # 若触及模型可见性
```

CI 门禁（示意）：

- `pnpm test` 全绿  
- kernel 包：变更文件行覆盖率门槛（建议 ≥ 90%，团队可调）  
- 新增 `packages/**/src/**` 必须伴随同包 `tests/**` 变更（脚本可检）  

### 13.5 新增官方插件 Checklist（TDD 版）

1. **先**建 `tests/`：装载失败用例、主工具/Remote 契约用例（Red）  
2. 写 `ah.contributes` + 最小 host 实现至绿  
3. 需要 UI：先写 slot 注册/卸载测，再写 client  
4. 若会调模型：接入 **MockLLM**（见 §14），禁止默认 live  
5. 若模型可见：补「从 SessionLog 重建」测试  
6. 挂 profile 模板 + 文档  

### 13.6 修改 AgentLoop Checklist（TDD 版）

1. 先更新/新增失败用例（queue、steer、abort、工具并行等）  
2. 再改 loop；保持模型可见 ⟺ 已记录  
3. 全套 agent-loop 测 + MockLLM 脚本场景必须绿  
4. 更新子系统文档  

### 13.7 禁止事项

- 新增第四种扩展通道（又一种「临时 mount」）  
- UI 组件直接 import 另一 UI 插件实现  
- 把展示用结构写入 SessionLog 冒充历史  
- 在无 disposer 的情况下注册全局 hook  
- **无测试合并 OOD**  
- **单测默认打真实 LLM**  

---

## 14. 测试策略与 MockLLM

### 14.1 测试金字塔

| 层级 | 占比（建议） | 内容 | LLM |
|------|--------------|------|-----|
| 单元 | 最多 | 纯函数、schema、surface、inbox、工具管线 | Mock / 假工具 |
| 组件/插件 | 多 | 装载卸载、Remote、权限 | MockLLM（若需要） |
| Loop 集成 | 中 | 真实 AgentLoop + MockLLM + 内存/临时 SessionLog | **MockLLM 必选** |
| 回放快照 | 中 | 固定 log → 期望 messages / tool schemas | 无（或录制自 Mock） |
| Live e2e | 少 | 真实提供方；`AH_LIVE_LLM=1` 才跑；无 key skip | 真 |

### 14.2 MockLLM 定位

MockLLM 是 **一等测试设施**，不是可有可无的辅助脚本。

职责：

- 提供 OpenAI 兼容（或本项目 LLM 适配器所针对）的 HTTP/SSE 端点  
- 按 **FIFO 行为脚本** 响应每次请求（成功流、断连、超时、限流、鉴权失败等）  
- 记录收到的请求体，供断言「发了什么 messages/tools/system」  
- 进程内可嵌（推荐单测）或独立端口（适配器/e2e）

推荐包名：`packages/test-support/mock-llm/`。

### 14.3 MockLLM API 约定（实现须满足）

```ts
type MockLlmBehavior =
  | { kind: 'success'; text?: string; toolCalls?: ToolCallScript[]; usage?: Usage }
  | { kind: 'stream_text'; deltas: string[]; delayMs?: number }
  | { kind: 'partial_disconnect'; deltas: string[] }
  | { kind: 'connection_reset' }
  | { kind: 'rate_limit'; retryAfterMs?: number }
  | { kind: 'auth_error' }
  | { kind: 'stall'; idleMs: number }

interface MockLlmServer {
  readonly baseURL: string
  readonly requests: readonly CapturedRequest[]
  close(): Promise<void>
}

function startMockLlmServer(options: {
  sequence: readonly MockLlmBehavior[]
  apiKey?: string
  repeatLast?: boolean
}): Promise<MockLlmServer>
```

规则：

1. 非法 HTTP/错误 key **不消耗** sequence 条目  
2. sequence 耗尽 → 结构化 500（或明确错误），测试应失败而非挂死  
3. 默认测试用 `baseURL` + fake key 注入 llm provider 配置  
4. 支持断言 `requests[i].body.messages` / `tools` 与 SessionLog 重建一致  

### 14.4 进程内 Fake Adapter（更快的单元路径）

除 HTTP MockLLM 外，kernel 单测可注册 **内存 FakeLlmAdapter**：

- 实现与正式 adapter 相同的 `stream()` 契约  
- 同样按 sequence 吐 chunk  
- 零端口、适合 agent-loop 海量用例  

约定：

- Fake Adapter 与 MockLLM **共享同一套 Behavior 类型**（避免两套剧本）  
- Provider 集成测必须打 **HTTP MockLLM**（至少一条），防止「假适配器绿、真适配器红」  

### 14.5 标准场景清单（AgentLoop / LLM 相关 OOD 必选子集）

每个触及模型的 OOD，按需覆盖（agent-loop **全部**覆盖）：

| 场景 ID | Behavior 脚本要点 | 断言 |
|---------|-------------------|------|
| `happy_text` | success 文本 | 一轮完成；log 可重建 |
| `tool_then_text` | toolCalls → success | 两 step；tool/result 入 log |
| `steer_midway` | 长 stream + steer | 下一 step 含 steer |
| `queue_two` | 两次 success | 两 turn FIFO |
| `cancel_running` | stall + cancel | 完全停稳；turn aborted |
| `max_tokens` | finish max-tokens | turn reason 正确 |
| `retry_then_ok` | rate_limit → success | 仅配置重试时 |
| `auth_fail` | auth_error | 错误结构化；无脏状态 |
| `partial_disconnect` | partial_disconnect | 恢复策略符合设计 |
| `reconstruct` | 任意成功路径 | `deriveMessages` == 当时请求 messages |

### 14.6 与 SessionLog 联测

凡 MockLLM / FakeAdapter 跑过的成功路径，至少一条测试做：

```text
跑完 → 取 session.events
→ deriveMessages() / request header
→ 深度等于（或规范相等）捕获到的 Mock 请求
```

这是「模型可见 ⟺ 已记录」的可执行门禁。

### 14.7 Live LLM

- 默认 CI **不跑**  
- 命名 `*.live.e2e.ts`；环境变量门禁  
- 不得替代 MockLLM 场景清单  

---

## 15. 版本与兼容

- Kernel 与 Plugin 约定用 semver  
- Session 格式版本单调；预览期可不提供迁移  
- Remote 字段删除走弃用窗口；生成客户端与 Host 同 PR 更新  
- MockLLM Behavior 类型变更视为测试设施 breaking，需同步改全仓剧本  

---

## 16. 里程碑建议（测试先行）

每个里程碑的 **入口标准** = 对应该范围的测试骨架已红/已挂好；**出口标准** = 全绿 + 文档更新。

### M0 — 可跑最小环

- **先**落地 `mock-llm` + FakeAdapter + 场景清单骨架  
- SessionLog / ToolRuntime / AgentLoop 按 TDD 完成  
- 一个 llm provider **只**打 MockLLM 绿  
- CLI headless 最小路径有集成测  

### M1 — 可装插件

- Plugin 装载/卸载测先写  
- Scratch / Promote 测先写  
- `--dump-config` 快照测  

### M2 — Web

- connection / runtime 契约测  
- UI slot 注册测  
- queue/steer 经 /api 的集成测（MockLLM）  

### M3 — 加固

- Sandbox / 审批表驱动测  
- Subagent one-shot + MockLLM  
- 回放快照流水线  

### M4 — 可选容器 sidecar

- 生命周期启停测（可用 testcontainers 或假 runtime）  
- 默认关闭的配置测  

---

## 17. 验收标准（架构级）

1. 新贡献者只学习 **Plugin + Profile** 即可扩展，无需理解「四条路」。  
2. 任意模型可见请求可从 SessionLog 重建；有自动化测试钉住。  
3. 卸载插件后工具/路由/UI slot 全部消失（无泄漏）。  
4. 默认 coding profile 包数量与概念远小于「全家桶」；可选能力显式安装。  
5. Scratch 重启仍在；Promote 后成为普通依赖。  
6. **每个已合并 OOD 均有对应测试**；CI 可检出「有 src 无 tests」的违规。  
7. **默认测试路径零真实 LLM Key**；MockLLM（或共享 Behavior 的 FakeAdapter）覆盖 §14.5 清单。  
8. AgentLoop 变更不得在 MockLLM 场景清单红着合并。  

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
    若仍欠工具续跑或有 steer → 下一 step
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
| OOD | 可交付设计单元（包/服务/Provider）；必须有对应用例 |
| MockLLM | 脚本化假 LLM HTTP/SSE 服务；默认测试依赖 |
| FakeAdapter | 进程内假 LLM 适配器；与 MockLLM 共享 Behavior |

---

## 20. 附录：TDD 提交示例

```text
# 1) 只加红测
git commit -m "test(agent-loop): add steer_midway MockLLM scenario (red)"

# 2) 最小实现致绿
git commit -m "feat(agent-loop): honor steer at next step boundary"

# 3) 重构仍绿
git commit -m "refactor(agent-loop): simplify inbox claim helper"
```

PR 模板须勾选：

- [ ] 本 PR 涉及的每个 OOD 均有测试变更  
- [ ] 未引入默认 live LLM 依赖  
- [ ] 触及模型可见性则含 reconstruction 断言  

---

## 21. 文档维护

- 架构变更先改本文，再改代码  
- 子系统细节可拆 `docs/subsystems/*.md`，但不得与本文冲突  
- 实现若偏离本文，须在 PR 中更新本文并说明原因  
- **新增 OOD 时同步更新 §13.4 映射表**  

---

*文档版本：0.2（设计稿 + 强制 TDD / MockLLM）*  
*对应讨论背景：DeepSeek Harness 源码分析后的收敛重设计*
