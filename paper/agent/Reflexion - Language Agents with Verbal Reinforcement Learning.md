---
title: "Reflexion: Language Agents with Verbal Reinforcement Learning"
type: paper-card
retrieved: 2026-06-02
year: 2023
status: NeurIPS 2023
publication_type: "conference"
venue: "NeurIPS 2023"
peer_reviewed: true
area:
  - agent method
  - reflection
  - self-correction
arxiv: "2303.11366"
url: "https://arxiv.org/abs/2303.11366"
authors:
  - Noah Shinn
  - Federico Cassano
  - Ashwin Gopinath
  - Karthik Narasimhan
  - Shunyu Yao
gpu_requirement: low
---
# Reflexion - Language Agents with Verbal Reinforcement Learning

## 核心问题

Agent 做错后能否不用更新模型参数，而是通过语言形式的经验总结来改进下一次尝试？

## 方法

Reflexion 让 agent 在失败后生成 verbal reflection，把错误原因和改进策略写入 episodic memory。下一轮尝试时，模型把这些反思作为上下文。

## 为什么重要

这是低显卡 self-improvement 的经典路线：不训练模型，只维护“失败记忆 + 反思文本”。

## 来源

- [arXiv:2303.11366](https://arxiv.org/abs/2303.11366)
- [NeurIPS 2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html)

