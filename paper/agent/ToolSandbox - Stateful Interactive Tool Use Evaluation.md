---
title: "ToolSandbox: A Stateful, Conversational, Interactive Evaluation Benchmark for LLM Tool Use Capabilities"
type: paper-card
retrieved: 2026-06-02
year: 2025
status: NAACL 2025 Findings
publication_type: "conference"
venue: "NAACL 2025 Findings"
venue_track: "Findings"
peer_reviewed: true
area:
  - tool-use reliability
  - evaluation
url: "https://aclanthology.org/2025.naacl-findings.65/"
gpu_requirement: low
---
# ToolSandbox - Stateful Interactive Tool Use Evaluation

## 核心问题

很多 tool-use benchmark 缺少状态变化和多轮交互，无法测 agent 在真实工具环境中的状态管理能力。

## 关键贡献

- Stateful、conversational、interactive tool-use 评测。
- 强调工具状态、用户交互和多步调用。
- 适合作为 tool-use agent 的基础评测参考。

## 对低显卡选题的启发

你可以把 Obsidian / 浏览器 / 文件系统看成 stateful tool environment，评估 agent 是否正确维护文件、元信息和引用。

## 来源

- [ACL Anthology: ToolSandbox](https://aclanthology.org/2025.naacl-findings.65/)

