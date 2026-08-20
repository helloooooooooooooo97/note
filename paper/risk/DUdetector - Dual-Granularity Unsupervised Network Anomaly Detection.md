---
title: "DUdetector: A dual-granularity unsupervised model for network anomaly detection"
type: paper-card
retrieved: 2026-06-02
year: 2024
status: Computer Networks 2024
publication_type: "journal"
venue: "Computer Networks"
peer_reviewed: true
learning_paradigm:
  - unsupervised
traffic_granularity:
  - packet
  - flow
task:
  - network anomaly detection
url: "https://www.sciencedirect.com/science/article/pii/S1389128624007692"
gpu_requirement: low-to-medium
---
# DUdetector - Dual-Granularity Unsupervised Network Anomaly Detection

## 核心问题

真实网络中未知攻击多、标签少，监督模型容易过拟合已知攻击。DUdetector 用无监督方式做网络异常检测。

## 方法

它从 segment 和 point 两个粒度学习异常模式，结合 Transformer 和 Conv1d/AutoEncoder 结构，强调双粒度检测。

## 适合的矩阵位置

- 无监督 × packet。
- 无监督 × flow。

## 来源

- [ScienceDirect: DUdetector](https://www.sciencedirect.com/science/article/pii/S1389128624007692)

