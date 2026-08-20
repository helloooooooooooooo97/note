---
title: "Toolformer: Language Models Can Teach Themselves to Use Tools"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: NeurIPS 2023
publication_type: "conference"
venue: "NeurIPS 2023"
peer_reviewed: true
area:
  - agent training
  - tool learning
arxiv: "2302.04761"
url: "https://arxiv.org/abs/2302.04761"
authors:
  - Timo Schick
  - Jane Dwivedi-Yu
  - Roberto Dessì
  - Roberta Raileanu
  - Maria Lomeli
  - Luke Zettlemoyer
  - Nicola Cancedda
  - Thomas Scialom
gpu_requirement: medium
---
# Toolformer - Language Models Can Teach Themselves to Use Tools

## 核心问题

模型如何学习何时调用工具、调用什么工具，而不是只靠 prompt 规则？

## 方法

Toolformer 让模型在普通文本中自监督地插入 API 调用，筛选能降低语言建模损失的调用样本，再用这些样本微调模型。

## 为什么重要

这是 tool-use finetuning 的经典入口。资源少时不一定复现训练，但可以借鉴它的“自动构造工具调用数据”思路。

## 来源

- [arXiv:2302.04761](https://arxiv.org/abs/2302.04761)
- [NeurIPS 2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/d842425e4bf79ba039352da0f658a906-Abstract-Conference.html)

