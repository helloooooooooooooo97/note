---
title: "Evo-Memory: Benchmarking LLM Agent Test-time Learning with Self-Evolving Memory"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-11-25
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - memory
arxiv: "2511.20857"
url: "https://arxiv.org/abs/2511.20857"
authors:
  - Tianxin Wei
  - Noveen Sachdeva
  - Benjamin Coleman
  - Zhankui He
  - Yuanchen Bei
  - Xuying Ning
  - Mengting Ai
  - Yunzhe Li
  - Jingrui He
  - Ed H. Chi
  - Chi Wang
  - Shuo Chen
  - Fernando Pereira
  - Wang-Cheng Kang
  - Derek Zhiyuan Cheng
gpu_requirement: low
---
# Evo-Memory - Benchmarking Test-Time Learning with Self-Evolving Memory

## 核心问题

Agent 的记忆应该能在任务流中自我更新、复用经验，而不是只做静态检索。

## 关键贡献

- 针对 self-evolving memory 的 streaming benchmark。
- 评估 test-time learning 和跨任务经验复用。
- 强调 statefulness 对长期任务的重要性。

## 对低显卡选题的启发

可以研究 research agent 如何在多次调研中积累“可信来源偏好”“常见错误”“检索策略”，并测试是否减少后续失败。

## 来源

- [arXiv:2511.20857](https://arxiv.org/abs/2511.20857)
- [Hugging Face paper page](https://huggingface.co/papers/2511.20857)
