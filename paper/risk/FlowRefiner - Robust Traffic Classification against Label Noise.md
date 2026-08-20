---
title: "FlowRefiner: A Robust Traffic Classification Framework against Label Noise"
type: paper-card
retrieved: 2026-06-02
year: 2026
status: ICLR 2026 under review / preprint
publication_type: "preprint"
venue: "OpenReview"
peer_reviewed: false
learning_paradigm:
  - weakly-supervised
  - supervised
traffic_granularity:
  - packet
  - flow
task:
  - robust traffic classification
  - label noise
url: "https://openreview.net/pdf?id=GKX9w731gu"
gpu_requirement: medium
---
# FlowRefiner - Robust Traffic Classification against Label Noise

## 核心问题

真实流量标签很容易有噪声，例如应用标签、攻击标签、包级/流级标签不一致。FlowRefiner 关注噪声标签下的鲁棒流量分类。

## 方法

论文提出跨粒度鲁棒分类框架，同时利用 packet-level 和 flow-level 信息来缓解 label noise。

## 适合的矩阵位置

- 弱监督 × packet。
- 弱监督 × flow。

## 来源

- [OpenReview PDF: FlowRefiner](https://openreview.net/pdf?id=GKX9w731gu)

