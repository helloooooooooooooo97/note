---
title: "FlowletFormer: Network Behavioral Semantic Aware Pre-training Model for Traffic Classification"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-08
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
learning_paradigm:
  - self-supervised
  - pretraining
traffic_granularity:
  - packet
  - flow
task:
  - traffic classification
arxiv: "2508.19924"
url: "https://arxiv.org/abs/2508.19924"
gpu_requirement: medium
---
# FlowletFormer - Network Behavioral Semantic Pre-training

## 核心问题

现有预训练模型往往难以同时捕获 packet structural characteristics、flow-level behavior、protocol semantics 和 inter-packet context。

## 方法

FlowletFormer 是面向网络流量分析的 BERT-based pre-training model，强调 flowlet 和网络行为语义。

## 适合的矩阵位置

- 自监督 × packet。
- 自监督 × flow。

## 来源

- [arXiv:2508.19924](https://arxiv.org/abs/2508.19924)

