---
title: "Coordination as an Architectural Layer for LLM-Based Multi-Agent Systems"
type: paper-card
retrieved: 2026-06-02
year: 2026
date: 2026-05-05
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - multi-agent workflow
  - coordination
  - agent system
arxiv: "2605.03310"
url: "https://arxiv.org/abs/2605.03310"
gpu_requirement: low
---
# Coordination as an Architectural Layer for LLM-Based Multi-Agent Systems

## 核心问题

多 agent 系统失败往往不是单个模型能力不足，而是协调层缺失：任务分配、状态同步、冲突处理、责任边界都可能出错。

## 方法

论文主张把 coordination 作为独立 architectural layer，而不是 prompt 里的隐式约定。

## 为什么重要

这对 multi-agent research workflow 很关键：searcher、reader、verifier、writer 之间需要明确协议和状态，而不是靠“大家聊一聊”。

## 来源

- [arXiv:2605.03310](https://arxiv.org/abs/2605.03310)

