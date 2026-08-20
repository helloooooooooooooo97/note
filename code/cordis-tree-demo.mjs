// A → B → C → D：Cordis 插件树的生成与递归卸载示例
//
// 运行前需要安装 @deepseek-ai/cordis：
//   npm i @deepseek-ai/cordis
// 然后：
//   node cordis-tree-demo.mjs

import { Context } from '@deepseek-ai/cordis'

const ctx = new Context()

// 每个插件：apply 里挂一个子插件（除了 D），并登记一个可回收的副作用
const A = {
  name: 'A',
  async apply(ctx) {
    ctx.effect(() => {
      console.log('  [A] effect 安装')
      return () => console.log('  [A] effect 回收')
    })
    console.log('  [A] apply：正在挂载 B……')
    await ctx.plugin(B)                 // ← 树从此处长出 B
  },
}

const B = {
  name: 'B',
  async apply(ctx) {
    ctx.effect(() => {
      console.log('  [B] effect 安装')
      return () => console.log('  [B] effect 回收')
    })
    console.log('  [B] apply：正在挂载 C……')
    await ctx.plugin(C)                 // ← 树从此处长出 C
  },
}

const C = {
  name: 'C',
  async apply(ctx) {
    ctx.effect(() => {
      console.log('  [C] effect 安装')
      return () => console.log('  [C] effect 回收')
    })
    console.log('  [C] apply：正在挂载 D……')
    await ctx.plugin(D)                 // ← 树从此处长出 D
  },
}

const D = {
  name: 'D',
  apply(ctx) {
    ctx.effect(() => {
      console.log('  [D] effect 安装')
      return () => console.log('  [D] effect 回收')
    })
    console.log('  [D] apply（叶子，不再挂载）')
  },
}

console.log('== 第 1 步：挂载 A ==')
const fiberA = await ctx.plugin(A)

console.log('\n== 树生成完毕，打印节点与父节点 ==')
for (const [, runtime] of ctx.registry.entries()) {
  for (const fiber of runtime.fibers) {
    if (fiber.name === 'Loader' || fiber.name === 'isolate' || fiber.name === 'Include') continue
    console.log(`  ${fiber.name}   ← 父: ${fiber.parent?.fiber?.name ?? '(根)'}`)
  }
}

console.log('\n== 第 2 步：只卸载 A，看 B/C/D 是否被递归回收 ==')
await fiberA.dispose()
console.log('== 卸载完成 ==')
