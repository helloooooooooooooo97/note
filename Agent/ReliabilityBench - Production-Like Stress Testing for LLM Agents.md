---
title: "ReliabilityBench: Evaluating LLM Agent Reliability Under Production-Like Stress Conditions"
type: paper-card
retrieved: 2026-06-02
year: 2026
date: 2026-01-03
status: preprint
publication_type: "preprint"
venue: "arXiv"
peer_reviewed: false
area:
  - tool-use reliability
  - evaluation
arxiv: "2601.06112"
url: "https://arxiv.org/abs/2601.06112"
authors:
  - Aayush Gupta
gpu_requirement: low
---
# ReliabilityBench - Production-Like Stress Testing for LLM Agents

## 核心问题

单次成功率不足以说明 agent 可上线。论文用 repeated execution、任务扰动和工具/API 故障注入来评估生产环境可靠性。

## 关键贡献

- 提出可靠性曲面 R(k, epsilon, lambda)。
- 用 action metamorphic relations 定义端状态等价。
- 做超时、限流、部分响应、schema drift 等故障注入。

## 对低显卡选题的启发

这是非常适合低显卡复现的方向：重点是评测协议、故障注入和日志分析，不需要训练模型。

## 来源

- [arXiv:2601.06112](https://arxiv.org/abs/2601.06112)

