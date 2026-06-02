---
title: "Self-Refine: Iterative Refinement with Self-Feedback"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: NeurIPS 2023 workshop / preprint
publication_type: "workshop"
venue: "NeurIPS 2023 Workshop"
peer_reviewed: true
area:
  - agent method
  - self-correction
  - reflection
arxiv: "2303.17651"
url: "https://arxiv.org/abs/2303.17651"
authors:
  - Aman Madaan
  - Niket Tandon
  - Prakhar Gupta
  - Skyler Hallinan
  - Luyu Gao
  - Sarah Wiegreffe
  - Uri Alon
gpu_requirement: low
---
# Self-Refine - Iterative Refinement with Self-Feedback

## 核心问题

LLM 能否自己评价自己的输出，并通过多轮反馈改进答案？

## 方法

Self-Refine 使用 generate -> feedback -> refine 循环，不需要额外训练，也不依赖外部标注。

## 为什么重要

在 agent 系统中可以作为 critic / editor 模块，用于修正检索计划、代码、Markdown 卡片和引用说明。

## 来源

- [arXiv:2303.17651](https://arxiv.org/abs/2303.17651)
- [项目页](https://selfrefine.info/)

