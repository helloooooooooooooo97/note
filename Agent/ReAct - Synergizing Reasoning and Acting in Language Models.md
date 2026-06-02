---
title: "ReAct: Synergizing Reasoning and Acting in Language Models"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: ICLR 2023
publication_type: "conference"
venue: "ICLR 2023"
peer_reviewed: true
area:
  - agent method
  - planning
  - tool use
arxiv: "2210.03629"
url: "https://arxiv.org/abs/2210.03629"
authors:
  - Shunyu Yao
  - Jeffrey Zhao
  - Dian Yu
  - Nan Du
  - Izhak Shafran
  - Karthik Narasimhan
  - Yuan Cao
gpu_requirement: low
---
# ReAct - Synergizing Reasoning and Acting in Language Models

## 核心问题

LLM 只做 chain-of-thought 容易停留在内部推理，无法和外部环境交互；只做 action 又缺少可解释规划。ReAct 把 reasoning trace 和 action trace 交织起来。

## 方法

模型在每一步先生成 thought，再选择 action，观察环境 observation 后继续推理。这个简单范式奠定了很多后续 tool agent / web agent 的基本结构。

## 为什么重要

如果你做 research agent，ReAct 是最基础 baseline：Search -> Read -> Think -> Act -> Observe 的循环几乎都从这里来。

## 来源

- [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)
- [ICLR 2023 OpenReview](https://openreview.net/forum?id=WE_vluYUL-X)

