---
title: "Evaluating Memory in LLM Agents via Incremental Multi-Turn Interactions"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-07-07
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - memory
  - evaluation
arxiv: "2507.05257"
url: "https://arxiv.org/abs/2507.05257"
authors:
  - Yuanzhe Hu
  - Yu Wang
  - Julian McAuley
gpu_requirement: low
---
# MemoryAgentBench - Evaluating Memory in LLM Agents

## 核心问题

Agent 的长期记忆不只是“能不能检索到过去内容”，还包括增量学习、长程理解和选择性遗忘。

## 关键贡献

- 提出 MemoryAgentBench。
- 定义四类记忆能力：accurate retrieval、test-time learning、long-range understanding、selective forgetting。
- 把静态长上下文数据转换为多轮增量交互形式。

## 对低显卡选题的启发

可以把“证据记忆”和“引用可验证性”结合：agent 不只记住事实，还要记住来源、时间、冲突证据和验证状态。

## 来源

- [arXiv:2507.05257](https://arxiv.org/abs/2507.05257)

