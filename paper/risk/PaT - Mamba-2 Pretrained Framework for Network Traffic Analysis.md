---
title: "PaT: An enhanced pretrained framework via Mamba-2 for network traffic analysis"
type: paper-card
retrieved: 2026-06-02
year: 2026
status: Computer Networks 2026
publication_type: "journal"
venue: "Computer Networks"
peer_reviewed: true
learning_paradigm:
  - self-supervised
  - pretraining
traffic_granularity:
  - packet
  - flow
task:
  - encrypted traffic analysis
url: "https://www.sciencedirect.com/science/article/pii/S1389128626003191"
gpu_requirement: medium
---
# PaT - Mamba-2 Pretrained Framework for Network Traffic Analysis

## 核心问题

Transformer 预训练在流量分析中有效，但长序列和轻量部署仍有挑战。PaT 引入 Mamba-2 架构做网络流量预训练。

## 方法

PaT 结合 reconstruction learning 和 self-supervised contrastive learning，用于 encrypted traffic analysis，并强调轻量化。

## 适合的矩阵位置

- 自监督 × packet。
- 自监督 × flow。

## 来源

- [ScienceDirect: PaT](https://www.sciencedirect.com/science/article/pii/S1389128626003191)

