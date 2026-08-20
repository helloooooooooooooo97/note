---
title: "Self-Supervised Transformer-based Contrastive Learning for Intrusion Detection Systems"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-05
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
learning_paradigm:
  - self-supervised
  - contrastive learning
traffic_granularity:
  - packet
task:
  - intrusion detection
arxiv: "2505.08816"
url: "https://arxiv.org/abs/2505.08816"
gpu_requirement: medium
---
# Self-Supervised Transformer Contrastive Learning for Raw Packet IDS

## 核心问题

很多 NIDS 依赖 NetFlow 手工统计特征，但 raw packet sequence 里有更细粒度的时序和协议信息。问题是包级标注成本高。

## 方法

论文用 Transformer encoder 和 contrastive learning 从 raw packet sequences 中学习表征，再用于异常/入侵识别。

## 适合的矩阵位置

- 自监督 × packet。

## 来源

- [arXiv:2505.08816](https://arxiv.org/abs/2505.08816)

