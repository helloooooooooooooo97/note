---
title: "Memex(RL): Scaling Long-Horizon LLM Agents via Indexed Experience Memory"
type: paper-card
retrieved: 2026-06-02
year: 2026
date: 2026-03-04
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - memory
  - agent training
  - agent RL
arxiv: "2603.04257"
url: "https://arxiv.org/abs/2603.04257"
gpu_requirement: high
---
# MemexRL - Scaling Long-Horizon LLM Agents via Indexed Experience Memory

## 核心问题

长程 agent 需要压缩上下文，但普通摘要会丢掉证据。如何在上下文预算下保存可检索经验？

## 方法

Memex 使用 indexed experience memory，并用 RL 优化写入和读取行为：学会总结什么、归档什么、如何建立索引、何时检索。

## 为什么重要

这篇把 memory 和 RL 结合。低显卡方向可以不做完整 RL，而是借鉴 indexed evidence memory 的设计。

## 来源

- [arXiv:2603.04257](https://arxiv.org/abs/2603.04257)

