---
title: "Multi-Mission Tool Bench: Assessing the Robustness of LLM based Agents through Related and Dynamic Missions"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-04-03
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - tool-use reliability
  - evaluation
arxiv: "2504.02623"
url: "https://arxiv.org/abs/2504.02623"
authors:
  - Peijie Yu
  - Yifan Yang
  - Jinjian Li
  - Zelong Zhang
  - Haorui Wang
  - Xiao Feng
  - Feng Zhang
gpu_requirement: low
---
# Multi-Mission Tool Bench - Robustness Through Dynamic Missions

## 核心问题

真实用户不会只给 agent 一个静态任务，而会不断切换、追加和修改任务。单任务 tool benchmark 测不出这种动态鲁棒性。

这篇论文抓住了一个很真实的 agent 痛点：用户和 agent 的互动不是“一问一答完成一个任务”，而是连续发生的任务流。比如用户先让 agent 查论文，接着让它按地区筛选，再补负责人，再要求改成 Markdown frontmatter。后面的任务往往依赖前面已经查到的信息、上下文和中间产物。普通单任务 benchmark 很难测出这种状态保持和任务切换能力。

论文因此提出 **Multi-Mission Tool Bench, MMTB**，专门评估 LLM agent 在“相关且动态变化的多个 mission”中的工具调用鲁棒性。

## 关键贡献

- 每个 test case 包含多个相关 mission。
- 设计 mission-switching patterns。
- 用动态决策树评估 agent 决策准确率和效率。

更细地说，它的贡献有四个：

1. **从 single-mission 转向 multi-mission**
   - 过去很多 tool-use benchmark 只测一次任务，例如“调用天气 API 查天气”。
   - MMTB 的每个测试样本包含 1 到 4 个连续 mission。
   - 后续 mission 和前序对话强相关，agent 必须从历史对话里提取信息。

2. **定义 mission type / action type**
   - 论文把 agent 完成 mission 的动作分成四大类：
     - 调用单个工具。
     - 调用多个工具。
     - 直接和用户聊天，不调用工具。
     - 先向用户澄清缺失参数，再调用工具。
   - 多工具调用又进一步区分 serial execution、parallel execution、serial + parallel 混合。

3. **覆盖 mission switching space**
   - 如果一个测试样本有多个 mission，每个 mission 都可能对应不同 action type。
   - 论文关心的不是单个 mission 难不难，而是 mission 类型怎么连续切换。
   - MMTB 在固定 mission 数量下尽量覆盖所有 action-type transition patterns。

4. **提出 dynamic decision tree 评测方法**
   - 多工具任务可能有不止一条正确执行路径。
   - 论文先分析工具依赖，再构造动态决策树。
   - agent 每调用一步工具，评测器就检查这个动作是否仍在合法路径中，并剪枝掉不可能的后续路径。
   - 最后不仅看是否成功，还看路径是否接近最优。

## Benchmark 是怎么构造的

论文用一个多角色数据生成框架来构造任务。它不是简单手写 prompt，而是用五个角色模拟完整任务生成和执行过程：

- **User**：提出 mission。
- **Planner**：分析任务、规划工具调用路径、决定 action type。
- **AI**：模拟被测 agent 的对话行为。
- **Tool**：模拟工具返回结果。
- **Checker**：检查规划格式和执行顺序是否合理。

生成流程大致是：

1. 先采样一个工具列表。
2. 指定希望生成的 action type。
3. 生成 user mission。
4. 为后续 mission 加入和前文的依赖关系。
5. 用多角色交互生成完整对话轨迹。
6. 人工选择和修正候选 mission，保证质量。

后续 mission 的关系被分成三类：

- **Implicit understanding**：用户没有明说全部信息，但可以从前文隐含推断。
- **Ellipsis**：用户省略了核心成分，例如“也帮我查一下另一个”。
- **Long-term memory**：需要 agent 记住较早之前出现过的信息。

这三类关系很像真实用户在多轮工作流里的说话方式。

## 数据规模与实验设置

- 数据集包含 **1,024 个 test entries**。
- 每条包含 1 到 4 个 missions。
- 按 mission 数量分成 4 个子集，每个子集 256 条。
- 评估了 24 个开源和闭源模型。

论文测试的模型包括：

- 闭源通用模型：o1、GPT-4o、Gemini-1.5-Pro、Mistral-Large、Doubao 等。
- 开源通用模型：Qwen2.5、GLM-4、DeepSeek-R1、DeepSeek-V3、Llama-3.3 等。
- 工具专用模型：ToolACE、Hammer2.1、watt-tool、xLAM、Gorilla OpenFunctions 等。

## 评估指标

论文主要看两个层面的指标。

**1. Success rate**

看 agent 是否完成了合法执行路径，也就是动作序列有没有走到正确终点。

**2. Optimality rate**

看 agent 是否使用了最少或更优的工具调用路径。  
这点很重要，因为真实 agent 不能只“最后做对”，还要考虑调用成本、延迟和冗余工具使用。

论文还使用 accomplished progress 这类进度指标，用来衡量 agent 即使没有完全成功，也完成到了哪一步。

## 主要实验发现

1. **多 mission 会明显拉低 agent 表现**
   - 即使强模型在单 mission 上表现不错，进入多 mission 后也会掉。
   - 论文中特别指出，连 o1 在多 mission 场景下也出现明显能力下降。

2. **专用 tool models 在多 mission 下不一定稳**
   - ToolACE、Hammer 等工具专用模型在单 mission 上可以接近强通用模型。
   - 但 mission 数量增加后，专用模型准确率下降更快。
   - 这说明“会调工具”和“能在动态任务流里稳定调工具”不是一回事。

3. **模型对不同 action type 的短板不同**
   - 有的模型擅长单工具调用。
   - 有的模型在多工具串并联调用上出错。
   - 很多模型尤其不擅长判断参数是否缺失，也就是不知道什么时候应该先问用户。

4. **long-term memory 关系最难**
   - 在三类 mission relationship 中，long-term memory 对性能影响最大。
   - Ellipsis 也会造成明显困难。
   - 这说明 agent 的工具调用失败经常不是因为 API 不会用，而是上下文状态没维护好。

## 这篇论文真正有价值的点

我觉得它最有价值的不是“又提出了一个 benchmark”，而是给了一个很好的观察角度：

> Agent robustness 应该放在连续任务流里测，而不是只看单次工具调用。

这对 research agent 特别关键。比如一个论文调研 agent 经常会经历：

1. 先搜索一个方向。
2. 再筛顶会论文。
3. 再补每篇的 venue。
4. 再加 frontmatter。
5. 再把每篇拆成 Obsidian 卡片。
6. 再根据用户新偏好重新排序。

这就是典型 multi-mission setting。失败点可能不是某一次搜索错了，而是后续任务没有正确继承前面的约束。

## 局限

- 最多只覆盖到 4 个 missions，真实长任务可能远超这个长度。
- 数据生成依赖 LLM 多角色模拟和人工修正，有一定构造成本。
- 任务主要围绕工具调用，较少覆盖真实网页、文件系统、PDF、代码仓库等复杂环境。
- 评估重点是 tool invocation path，对最终答案质量、引用质量、证据一致性关注不够。

## 对低显卡选题的启发

适合改造成“调研任务流”：用户不断追加约束，比如“只要香港团队”“补负责人”“加 frontmatter”，观察 agent 是否保持一致状态。

一个更接近顶会的延展选题可以是：

> **Research-MissionBench: Evaluating LLM Research Agents under Dynamic User Revisions and Evidence Constraints**

可以借鉴 MMTB，但做出几个差异：

- 把工具调用场景换成 research workflow：搜索、读网页、读 PDF、抽取 claim、写 Markdown、更新 frontmatter。
- 后续 mission 必须依赖前文，例如“把刚才那 12 篇里只保留 peer-reviewed 的”。
- 加入 evidence constraint：每个结论必须有 URL、日期、引用支持。
- 加入 file-state constraint：agent 修改文件时不能破坏已有结构。
- 评估不仅看成功率，还看引用正确性、状态一致性、增量修改正确性。

这个方向显卡需求很低，但研究问题很清楚，而且和 agent evaluation、tool-use reliability、memory、human-agent interaction 都能挂上。

## 来源

- [arXiv:2504.02623](https://arxiv.org/abs/2504.02623)
- [论文 HTML 版本](https://ar5iv.labs.arxiv.org/html/2504.02623v3)
- [代码仓库：MMTB](https://github.com/yupeijei1997/MMTB)
