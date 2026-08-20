---
title: "Risk 方向论文卡片索引 - 网络流量安全"
type: paper-index
retrieved: 2026-06-02
scope:
  - network risk
  - intrusion detection
  - anomaly detection
  - traffic classification
  - packet
  - flow
  - graph/network
matrix:
  learning_paradigm:
    - unsupervised
    - self-supervised
    - weakly-supervised
    - semi-supervised
    - supervised
    - LLM
  traffic_granularity:
    - packet
    - flow
    - graph/network
---
# Risk 方向论文卡片索引 - 网络流量安全

## 选题矩阵

| 范式    | Packet 包级                                                                                                                                            | Flow 流级                                                                                                                                             | Graph / Network 网络级                                                                                         |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 无监督   | [[DUdetector - Dual-Granularity Unsupervised Network Anomaly Detection]]                                                                             | [[On-the-fly Memory-aware Unsupervised Network Anomaly Detection - Survey]]                                                                         | [[Anomal-E and GNN-based Unsupervised NIDS - Graph Survey Entry]]                                           |
| 自监督   | [[Self-Supervised Transformer Contrastive Learning for Raw Packet IDS]] / [[ET-BERT - Pre-training Datagram Representations for Encrypted Traffic]]  | [[PaT - Mamba-2 Pretrained Framework for Network Traffic Analysis]] / [[FlowletFormer - Network Behavioral Semantic Pre-training]]                  | [[GraphIDS - Self-Supervised Graph Representations for NIDS]]                                               |
| 弱/半监督 | [[Network Traffic Classification with Self-Supervised and Confident Learning]] / [[FlowRefiner - Robust Traffic Classification against Label Noise]] | [[Robust Semi-Supervised Temporal Intrusion Detection for Adversarial Cloud Networks]]                                                              | [[Pseudo-Metapaths - Graph-based Intrusion Detection in Optical Networks]]                                  |
| 监督    | [[FlowTransformer - Transformer Framework for Flow-based NIDS]]                                                                                      | [[FlowTransformer - Transformer Framework for Flow-based NIDS]]                                                                                     | [[BS-GAT - Graph Neural NIDS for Edge Computing]] / [[XMF-GNN - Cross-Modality Heterogeneous GNN for NIDS]] |
| 大模型   | [[Payload-Aware Intrusion Detection with CMAE and LLMs]]                                                                                             | [[TrafficLLM - Generic Traffic Representation for Network Traffic Analysis]] / [[From Flows to Words - Zero-Few-Shot LLMs for Intrusion Detection]] | [[MA-IDS - Multi-Agent RAG for IoT Network Intrusion Detection]] / [[eX-NIDS - Explainable NIDS with LLMs]] |

## 2026 重点

- [[MA-IDS - Multi-Agent RAG for IoT Network Intrusion Detection]]
- [[Robust Semi-Supervised Temporal Intrusion Detection for Adversarial Cloud Networks]]
- [[PaT - Mamba-2 Pretrained Framework for Network Traffic Analysis]]
- [[An Enhanced Traffic Classifier Based on Self-Supervised Feature Learning]]
- [[Self-supervised GNNs for NIDS in Cloud-Edge Collaboration]]
- [[On-the-fly Memory-aware Unsupervised Network Anomaly Detection - Survey]]

## 读法建议

如果目标是低算力但有研究贡献，优先看：

- **自监督 × packet/flow**：预训练和表征学习，适合做小模型、迁移和少标签。
- **弱/半监督 × flow/network**：真实场景标签少、标签噪声大，更容易讲出问题价值。
- **LLM × flow/network**：不要直接让 LLM 读 raw packet，而是让它做解释、规则总结、误报分析、RAG 经验库。

