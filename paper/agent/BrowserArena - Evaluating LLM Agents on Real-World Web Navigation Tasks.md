---
title: "BrowserArena: Evaluating LLM Agents on Real-World Web Navigation Tasks"
type: paper-card
retrieved: 2026-06-02
year: 2025
date: 2025-10-02
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - evaluation
  - environment
  - human feedback
arxiv: "2510.02418"
url: "https://arxiv.org/abs/2510.02418"
authors:
  - Sagnik Anupam
  - Davis Brown
  - Shuo Li
  - Eric Wong
  - Hamed Hassani
  - Osbert Bastani
gpu_requirement: low
---
# BrowserArena - Evaluating LLM Agents on Real-World Web Navigation Tasks

## 核心问题

现有 web agent benchmark 很多是沙盒任务，和真实开放网页差距大。BrowserArena 提出 live open-web agent evaluation，用用户提交任务、Arena-style 对战和 step-level human feedback 来暴露失败模式。

## 关键贡献

- 开放网页导航评测平台。
- 基于人类逐步反馈分析 agent trace。
- 识别 captcha、弹窗、直接 URL 导航等常见失败模式。

## 对低显卡选题的启发

可以借鉴它的 live / human-feedback 设计，做香港真实网页 agent benchmark：高校、政府、PDF、繁中/英文混排网页。

## 来源

- [arXiv:2510.02418](https://arxiv.org/abs/2510.02418)

