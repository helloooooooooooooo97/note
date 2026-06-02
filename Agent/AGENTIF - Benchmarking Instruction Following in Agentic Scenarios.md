---
title: "AGENTIF: Benchmarking Instruction Following of Large Language Models in Agentic Scenarios"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-05-22
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - evaluation
  - tool-use reliability
arxiv: "2505.16944"
url: "https://arxiv.org/abs/2505.16944"
authors:
  - Yunjia Qi
  - Hao Peng
  - Xiaozhi Wang
  - Amy Xin
  - Youfeng Liu
  - Bin Xu
  - Lei Hou
  - Juanzi Li
gpu_requirement: low
---
# AGENTIF - Benchmarking Instruction Following in Agentic Scenarios

## 核心问题

Agent 场景下的指令通常很长，包含系统 prompt、工具说明和复杂约束。模型是否真的遵守这些约束仍缺少系统评测。

## 关键贡献

- 针对 agentic scenarios 的 instruction following benchmark。
- 任务来自 50 个真实 agent 应用。
- 指令长、约束多，覆盖工具规格和条件约束。

## 对低显卡选题的启发

可以做“可审计 research agent”的约束遵循评测：引用必须真实、日期必须最新、每个结论必须有来源、文件必须有 frontmatter。

## 来源

- [arXiv:2505.16944](https://arxiv.org/abs/2505.16944)

