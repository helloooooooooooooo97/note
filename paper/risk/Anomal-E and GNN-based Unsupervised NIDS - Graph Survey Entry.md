---
title: "Anomal-E and GNN-based Unsupervised NIDS - Graph Survey Entry"
type: paper-card
retrieved: 2026-06-02
year: 2024
status: survey entry
publication_type: "survey note"
venue: "Computers & Security survey context"
peer_reviewed: false
learning_paradigm:
  - unsupervised
  - self-supervised
traffic_granularity:
  - graph/network
task:
  - graph-based intrusion detection
url: "https://www.sciencedirect.com/science/article/pii/S0167404824001226"
gpu_requirement: low-to-medium
---
# Anomal-E and GNN-based Unsupervised NIDS - Graph Survey Entry

## 核心问题

网络攻击往往体现在通信关系和行为结构中。Graph-based NIDS 试图把主机、端口、流、服务关系建模成图，再做异常检测。

## 内容

这张卡片作为图无监督 NIDS 的入口。相关综述提到 Anomal-E 一类方法使用 E-GraphSAGE 做 unsupervised representation learning，再用 PCA / Isolation Forest 等方法检测异常。

## 适合的矩阵位置

- 无监督 × graph/network。
- 自监督 × graph/network。

## 来源

- [ScienceDirect: GNN for IDS survey](https://www.sciencedirect.com/science/article/pii/S0167404824001226)
- [arXiv: Applying SSL to NIDS with GNN](https://arxiv.org/abs/2403.01501)

