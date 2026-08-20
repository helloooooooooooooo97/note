// cordis-event-demo.mjs
//
// 演示 Cordis 事件系统的五种分发模式：
//   emit      广播通知（观察者，不关心返回值）
//   parallel  并行扇出（全部完成才继续）
//   serial    按序裁决（第一个有效返回值胜出）
//   bail      serial 的同步版（缓存/路由优先）
//   waterfall 环绕中间件（层层包装，可短路）
//
// 场景：一次"发布部署"流程。
//
// 运行前需要安装 @deepseek-ai/cordis：
//   npm i @deepseek-ai/cordis
// 然后：
//   node cordis-event-demo.mjs
//
// ── 预期输出 ─────────────────────────────────────────────
// ===== 1. emit：广播通知 =====
//   [日志] api-server 部署完成
//   [UI]  刷新 api-server 状态
//   [统计] api-server 部署次数 +1
//
// ===== 2. parallel：并行健康检查 =====
//   [检查] 缓存 ok（20ms）      ← 快的先完成（顺序不固定）
//   [检查] 磁盘 ok（40ms）
//   [检查] 数据库 ok（60ms）
//   全部检查通过，开始发布
//
// ===== 3. serial：按序裁决 =====
//   [处理器1] 我能处理 Markdown 吗？不能
//   [处理器2] 我能处理 HTML 吗？能！
//   胜出者： html-handler        ← 处理器3 不会执行
//
// ===== 4. bail：同步版 serial =====
//   路由结果： cache-hit         ← 第一个监听器直接命中
//
// ===== 5. waterfall：环绕中间件 =====
//   [鉴权] 检查 token...
//   [限流] 检查配额...
//   → [日志包装] 业务处理结果     ← 层层 next() 包装
//   [鉴权] 检查 token...
//   → 401 未授权（短路，下游不执行）  ← 不调 next() 即短路
// ─────────────────────────────────────────────────────────

import { Context } from '@deepseek-ai/cordis'

const ctx = new Context()

// ===== 1. emit：广播通知（观察者，不关心返回值）=====
// 预期：三个监听器各自打印一行
console.log('===== 1. emit：广播通知 =====')
ctx.on('deploy/done', (app) => console.log(`  [日志] ${app} 部署完成`))
ctx.on('deploy/done', (app) => console.log(`  [UI]  刷新 ${app} 状态`))
ctx.on('deploy/done', (app) => console.log(`  [统计] ${app} 部署次数 +1`))
ctx.emit('deploy/done', 'api-server')

// ===== 2. parallel：并行健康检查（全部完成才继续）=====
// 预期：三个检查并行，完成顺序不固定，最后统一打印"全部检查通过"
console.log('\n===== 2. parallel：并行健康检查 =====')
ctx.on('health/check', () => new Promise((r) => setTimeout(() => {
  console.log('  [检查] 数据库 ok（60ms）')
  r()
}, 60)))
ctx.on('health/check', () => new Promise((r) => setTimeout(() => {
  console.log('  [检查] 缓存 ok（20ms）')
  r()
}, 20)))
ctx.on('health/check', () => new Promise((r) => setTimeout(() => {
  console.log('  [检查] 磁盘 ok（40ms）')
  r()
}, 40)))
await ctx.parallel('health/check')
console.log('  全部检查通过，开始发布')

// ===== 3. serial：按序裁决（第一个有效返回值胜出）=====
// 预期：处理器2 返回非空值后截断，处理器3 不执行
console.log('\n===== 3. serial：按序裁决 =====')
ctx.on('format/handle', () => {
  console.log('  [处理器1] 我能处理 Markdown 吗？不能')
  return null
})
ctx.on('format/handle', () => {
  console.log('  [处理器2] 我能处理 HTML 吗？能！')
  return 'html-handler'
})
ctx.on('format/handle', () => {
  console.log('  [处理器3] 不会被执行')
  return 'md-handler'
})
const winner = await ctx.serial('format/handle')
console.log('  胜出者：', winner)

// ===== 4. bail：同步版 serial（缓存/路由优先）=====
// 预期：同步返回第一个有效值 'cache-hit'
console.log('\n===== 4. bail：同步版 serial =====')
ctx.on('route', () => 'cache-hit')
ctx.on('route', () => 'db-query')
console.log('  路由结果：', ctx.bail('route'))

// ===== 5. waterfall：环绕中间件（层层包装，可短路）=====
// 预期：正常请求逐层 next() 并包装；无 token 请求在鉴权层短路
console.log('\n===== 5. waterfall：环绕中间件 =====')
ctx.on('request', async (req, next) => {
  console.log('  [鉴权] 检查 token...')
  if (!req.token) return '401 未授权（短路，下游不执行）'
  return next()
})
ctx.on('request', async (req, next) => {
  console.log('  [限流] 检查配额...')
  if (req.burst) return '429 限流（短路）'
  return next()
})
ctx.on('request', async (req, next) => {
  const result = await next()
  return `[日志包装] ${result}`
})
console.log('  →', await ctx.waterfall('request', { token: 'abc' }, async () => '业务处理结果'))
console.log('  →', await ctx.waterfall('request', { token: '', burst: true }, async () => '业务处理结果'))
