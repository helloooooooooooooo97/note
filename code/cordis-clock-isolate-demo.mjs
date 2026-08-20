// cordis-clock-isolate-demo.mjs
//
// 演示 ctx.isolate() 的经典用法：测试替身（mock）。
//
// 场景：应用里有一个全局 clock 服务。
//   - 生产代码要真实时间；
//   - 测试代码需要固定时间（可重复、可断言）。
//
// 做法：
//   1. 全局注册 RealClock（默认域）
//   2. ctx.isolate('clock', label) 划一个沙箱作用域（只换 clock 的钥匙）
//   3. 沙箱内注册 MockClock（进沙箱标签的抽屉）
//   4. 卸载 MockClock，观察沙箱内消费者自动失去依赖
//
// 运行前需要安装 @deepseek-ai/cordis：
//   npm i @deepseek-ai/cordis
// 然后：
//   node cordis-clock-isolate-demo.mjs

import { Context, Service } from '@deepseek-ai/cordis'

// 真实时钟：生产用
class RealClock extends Service {
  constructor(ctx) {
    super(ctx, 'clock')
  }

  now() {
    return new Date().toLocaleTimeString('zh-CN', { hour12: false })
  }
}

// 假时钟：测试用（固定时间）
class MockClock extends Service {
  constructor(ctx) {
    super(ctx, 'clock')
  }

  now() {
    return '2026-08-14 00:00:00（mock）'
  }
}

// 一个"使用时钟"的消费者插件
const clockUser = (label) => ({
  name: `${label}-用户`,
  inject: ['clock'],
  apply(ctx) {
    ctx.effect(() => {
      console.log(`  [${label}-用户] 现在是 ${ctx.clock.now()}`)
      return () => console.log(`  [${label}-用户] 卸载（clock 依赖消失）`)
    })
  },
})

// ===== 第 1 步：全局注册真实时钟 =====
const ctx = new Context()
await ctx.plugin(RealClock)
await ctx.plugin(clockUser('生产'))

// ===== 第 2 步：划沙箱作用域（只隔离 clock 这个服务名）=====
const sandboxLabel = Symbol('sandbox')
const sandbox = ctx.isolate('clock', sandboxLabel)

// ===== 第 3 步：沙箱内注册假时钟 =====
await sandbox.plugin(MockClock)
await sandbox.plugin(clockUser('测试'))

await new Promise((r) => setTimeout(r, 50))

// ===== 第 4 步：卸载假时钟，观察沙箱内消费者的反应 =====
console.log('\n== 卸载 MockClock，看沙箱消费者反应 ==')
const mockFiber = [...ctx.registry.values()]
  .flatMap((runtime) => [...runtime.fibers])
  .find((fiber) => fiber.name === 'MockClock')
await mockFiber.dispose()
await new Promise((r) => setTimeout(r, 50))
console.log('== 完成 ==')
