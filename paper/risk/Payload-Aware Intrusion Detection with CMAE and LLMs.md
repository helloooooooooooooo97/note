---
title: "Payload-Aware Intrusion Detection with CMAE and Large Language Models"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-03
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
learning_paradigm:
  - supervised
  - LLM
traffic_granularity:
  - packet
task:
  - payload-aware intrusion detection
url: "https://www.aimodels.fyi/papers/arxiv/payload-aware-intrusion-detection-cmae-large-language"
gpu_requirement: medium
---
# Payload-Aware Intrusion Detection with CMAE and LLMs

## 核心问题

包级 payload 包含重要攻击线索，但通用 LLM 是否真的适合直接做 payload-aware intrusion detection？

## 方法与发现

该研究比较专用 CMAE 架构与 GPT-4、Claude 等 LLM。摘要结果显示专用模型仍优于通用 LLM，但 LLM 的差距在缩小。

## 适合的矩阵位置

- 监督 × packet。
- 大模型 × packet。

## 来源

- [AI Models summary](https://www.aimodels.fyi/papers/arxiv/payload-aware-intrusion-detection-cmae-large-language)

