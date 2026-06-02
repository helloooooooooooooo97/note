---
title: "Language Agent Tree Search Unifies Reasoning, Acting, and Planning in Language Models"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - agent method
  - planning
  - reflection
arxiv: "2310.04406"
url: "https://arxiv.org/abs/2310.04406"
authors:
  - Andy Zhou
  - Kai Yan
  - Michihiro Yasunaga
  - Yuhuai Wu
  - Antoine Bosselut
  - Kai-Wei Chang
  - James Zou
gpu_requirement: low-to-medium
---
# LATS - Language Agent Tree Search

## 核心问题

ReAct 偏在线单路径执行，Tree of Thoughts 偏离线推理搜索。LATS 试图把 acting、planning、reasoning、reflection 统一成搜索。

## 方法

LATS 使用 Monte Carlo Tree Search 风格的搜索，在环境交互中生成动作、评估状态、反思失败并继续探索。

## 为什么重要

这是 planner / verifier / critic 架构的强方法参考，适合做“低显卡但更像方法论文”的 agent 方向。

## 来源

- [arXiv:2310.04406](https://arxiv.org/abs/2310.04406)

