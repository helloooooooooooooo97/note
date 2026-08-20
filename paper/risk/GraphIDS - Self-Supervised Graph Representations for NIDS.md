---
title: "Self-Supervised Learning of Graph Representations for Network Intrusion Detection"
type: paper-card
retrieved: 2026-06-02
year: 2025
status: NeurIPS 2025
publication_type: "conference"
venue: "NeurIPS 2025"
peer_reviewed: true
learning_paradigm:
  - self-supervised
traffic_granularity:
  - flow
  - graph/network
task:
  - network intrusion detection
arxiv: "2509.16625"
url: "https://arxiv.org/abs/2509.16625"
gpu_requirement: medium
---
# GraphIDS - Self-Supervised Graph Representations for NIDS

## 核心问题

Flow-level 特征忽略了主机、端口、通信关系等网络结构。GraphIDS 把网络流放进图结构里，用自监督方式学习正常通信模式。

## 方法

论文使用 inductive GNN 编码局部拓扑上下文，再用 Transformer encoder-decoder 重建 embedding，学习全局共现模式。

## 适合的矩阵位置

- 自监督 × flow。
- 自监督 × network。

## 来源

- [arXiv:2509.16625](https://arxiv.org/abs/2509.16625)
- [ML Anthology: NeurIPS 2025](https://mlanthology.org/neurips/2025/guerra2025neurips-selfsupervised/)

