---
title: "XMF-GNN: A cross-modality dynamic fusion heterogeneous graph neural network for network intrusion detection"
type: paper-card
retrieved: 2026-06-02
year: 2025
status: Neurocomputing 2025
publication_type: "journal"
venue: "Neurocomputing"
peer_reviewed: true
learning_paradigm:
  - supervised
traffic_granularity:
  - packet
  - flow
  - graph/network
task:
  - network intrusion detection
url: "https://www.sciencedirect.com/science/article/pii/S0925231225019575"
gpu_requirement: medium-to-high
---
# XMF-GNN - Cross-Modality Heterogeneous GNN for NIDS

## 核心问题

只用 flow 或只用 packet 都会丢信息。XMF-GNN 把 flow-level 和 packet-level 信息融合为异构图。

## 方法

论文将 flow 和 packet 数据转换为 heterogeneous graph，再用 HGNN 和 attention-based fusion 做检测。

## 适合的矩阵位置

- 监督 × packet。
- 监督 × flow。
- 监督 × graph/network。

## 来源

- [ScienceDirect: XMF-GNN](https://www.sciencedirect.com/science/article/pii/S0925231225019575)

