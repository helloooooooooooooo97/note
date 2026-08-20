---
title: "ET-BERT: A Contextualized Datagram Representation with Pre-training Transformers for Encrypted Traffic Classification"
type: paper-card
retrieved: 2026-06-02
year: 2022
status: WWW 2022
publication_type: "conference"
venue: "WWW 2022"
peer_reviewed: true
learning_paradigm:
  - self-supervised
  - pretraining
traffic_granularity:
  - packet
  - flow
task:
  - encrypted traffic classification
url: "https://dl.acm.org/doi/10.1145/3485447.3512217"
gpu_requirement: medium
---
# ET-BERT - Pre-training Datagram Representations for Encrypted Traffic

## 核心问题

加密流量看不到明文 payload，传统 DPI 和端口规则失效。ET-BERT 把 datagram / burst 当成类似文本 token 的序列，用 BERT 风格预训练学习流量上下文表示。

## 方法

核心是从大量未标注加密流量中做自监督预训练，然后迁移到流量分类任务。

## 为什么重要

这是“自监督 + 包/流级流量表示”的经典入口。后续很多 2025-2026 网络流量 foundation model 都会拿它当 baseline。

## 来源

- [ACM: ET-BERT](https://dl.acm.org/doi/10.1145/3485447.3512217)

