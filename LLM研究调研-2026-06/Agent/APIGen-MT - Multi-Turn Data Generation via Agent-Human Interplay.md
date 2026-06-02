---
title: "APIGen-MT: Agentic Pipeline for Multi-Turn Data Generation via Simulated Agent-Human Interplay"
type: paper-card
retrieved: 2026-06-02
year: 2025
status: NeurIPS 2025 Datasets and Benchmarks Track
publication_type: "conference"
venue: "NeurIPS 2025"
venue_track: "Datasets and Benchmarks Track"
peer_reviewed: true
area:
  - tool-use reliability
  - human-agent interaction
  - data generation
url: "https://papers.neurips.cc/paper_files/paper/2025/hash/5e3661f7fe4c8ac5652d62eb3d3c96ea-Abstract-Datasets_and_Benchmarks_Track.html"
gpu_requirement: low-to-medium
---
# APIGen-MT - Multi-Turn Data Generation via Agent-Human Interplay

## 核心问题

训练多轮工具调用 agent 需要高质量人机交互数据，但人工采集成本高。

## 关键贡献

- 通过 agentic pipeline 生成 task blueprints 和完整多轮轨迹。
- 使用 simulated human-agent interplay。
- 开源 synthetic data 和 xLAM-2-fc-r 模型。

## 对低显卡选题的启发

可以用类似 synthetic task blueprint 的方式构造香港 research agent benchmark，先生成任务蓝图，再人工抽查质量。

## 来源

- [NeurIPS 2025: APIGen-MT](https://papers.neurips.cc/paper_files/paper/2025/hash/5e3661f7fe4c8ac5652d62eb3d3c96ea-Abstract-Datasets_and_Benchmarks_Track.html)

