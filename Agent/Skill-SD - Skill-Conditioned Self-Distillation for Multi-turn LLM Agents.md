---
title: "Skill-SD: Skill-Conditioned Self-Distillation for Multi-turn LLM Agents"
type: paper-card
retrieved: 2026-06-02
year: 2026
date: 2026-04-12
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - agent training
  - self-distillation
  - skill learning
arxiv: "2604.10674"
url: "https://arxiv.org/abs/2604.10674"
gpu_requirement: high
---
# Skill-SD - Skill-Conditioned Self-Distillation for Multi-turn LLM Agents

## 核心问题

Multi-turn agent training 中，轨迹监督往往噪声大、样本效率低。能否把轨迹抽象成 skill 来辅助训练？

## 方法

Skill-SD 将 agent trajectories 转成动态自然语言 skills，用 skill-conditioned self-distillation 提升多轮 agent。

## 为什么重要

如果你走轻量路线，可以借鉴“从轨迹中抽象技能”的思想，用于 prompt skill library，而不是训练大模型。

## 来源

- [arXiv:2604.10674](https://arxiv.org/abs/2604.10674)

