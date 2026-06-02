---
title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: NeurIPS 2023
publication_type: "conference"
venue: "NeurIPS 2023"
peer_reviewed: true
area:
  - agent method
  - planning
  - search
arxiv: "2305.10601"
url: "https://arxiv.org/abs/2305.10601"
authors:
  - Shunyu Yao
  - Dian Yu
  - Jeffrey Zhao
  - Izhak Shafran
  - Thomas L. Griffiths
  - Yuan Cao
  - Karthik Narasimhan
gpu_requirement: low
---
# Tree of Thoughts - Deliberate Problem Solving with LLMs

## 核心问题

Chain-of-thought 是单路径推理，容易一条路走到黑。复杂任务需要显式搜索多个中间思路。

## 方法

Tree of Thoughts 把 thought 当成搜索节点，模型生成多个候选 thought，再通过评估、剪枝、回溯找到更优路径。

## 为什么重要

适合做 planner / verifier 结构的 baseline。research agent 中也可以把“检索计划”“论文筛选计划”“证据验证计划”看成 thought search。

## 来源

- [arXiv:2305.10601](https://arxiv.org/abs/2305.10601)
- [NeurIPS 2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/271db9922b8d1f4dd7aaef84ed5ac703-Abstract-Conference.html)

