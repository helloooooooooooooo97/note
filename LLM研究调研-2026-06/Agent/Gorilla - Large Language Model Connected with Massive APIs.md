---
title: "Gorilla: Large Language Model Connected with Massive APIs"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: ICLR 2024
publication_type: "conference"
venue: "ICLR 2024"
peer_reviewed: true
area:
  - agent training
  - tool learning
  - API calling
arxiv: "2305.15334"
url: "https://arxiv.org/abs/2305.15334"
gpu_requirement: medium
---
# Gorilla - Large Language Model Connected with Massive APIs

## 核心问题

LLM 调 API 时容易 hallucinate API 名称、参数和版本。Gorilla 关注如何让模型可靠调用大量真实 API。

## 方法

论文构造 APIBench，并训练/评估模型在大量机器学习 API 上的调用准确性。

## 为什么重要

如果做 tool-use reliability，Gorilla 是 API hallucination 和 retrieval-aware tool calling 的重要基线。

## 来源

- [arXiv:2305.15334](https://arxiv.org/abs/2305.15334)
- [项目页](https://gorilla.cs.berkeley.edu/)

