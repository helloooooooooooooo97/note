---
title: "Network Traffic Classification Using Self-Supervised Learning and Confident Learning"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-09
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
learning_paradigm:
  - self-supervised
  - weakly-supervised
traffic_granularity:
  - packet
  - flow
task:
  - traffic classification
  - pseudo-label refinement
arxiv: "2509.23522"
url: "https://arxiv.org/abs/2509.23522"
gpu_requirement: medium
---
# Network Traffic Classification with Self-Supervised and Confident Learning

## 核心问题

流量分类标签往往有噪声，特别是加密流量和动态端口场景。直接监督训练容易被错误标签拖垮。

## 方法

论文结合 self-supervised learning 和 traffic-adopted confident learning，先学习表示，再修正伪标签/噪声标签。

## 适合的矩阵位置

- 弱监督 × packet。
- 弱监督 × flow。

## 来源

- [arXiv:2509.23522](https://arxiv.org/abs/2509.23522)

