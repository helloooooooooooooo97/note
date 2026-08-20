---
title: "MA-IDS: Multi-Agent RAG Framework for IoT Network Intrusion Detection with an Experience Library"
type: paper-card
retrieved: 2026-06-02
year: 2026
date: 2026-04
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
learning_paradigm:
  - LLM
  - RAG
  - multi-agent
traffic_granularity:
  - flow
  - graph/network
task:
  - IoT intrusion detection
  - error analysis
arxiv: "2604.05458"
url: "https://arxiv.org/abs/2604.05458"
gpu_requirement: low
---
# MA-IDS - Multi-Agent RAG for IoT Network Intrusion Detection

## 核心问题

传统模型即使检测准确，也难以解释错误、积累经验、适应新型攻击。MA-IDS 用 LLM + RAG + multi-agent 做推理型 IDS。

## 方法

系统包含 Traffic Classification Agent 和 Error Analysis Agent，通过 FAISS experience library 存储错误规则，实现外部知识累积而不修改底层模型。

## 适合的矩阵位置

- 大模型 × flow。
- 大模型 × network。

## 来源

- [arXiv:2604.05458](https://arxiv.org/abs/2604.05458)

