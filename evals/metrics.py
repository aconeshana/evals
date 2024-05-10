"""
This file defines various common metrics of interest.
准确率（Accuracy）：是最直观的性能指标，表示正确预测的数量占总样本数的比例。计算方式为正确预测的事件数除以总事件数。

Bootstrap准确率标准差（Bootstrap Accuracy Standard Deviation）：通过对数据进行重采样来估计准确率的标准差，从而可以得到准确率的不确定性估计。这是一种评估模型稳定性的方法。

混淆矩阵（Confusion Matrix）：是一个表格，用于描述模型预测与实际类别之间的关系。它显示了每个真实类别被预测为每个预测类别的次数，从而可以详细了解模型在哪些类别上表现好，哪些类别上表现差。

Matthews相关系数（Matthews Correlation Coefficient, MCC）：是一个介于-1和1之间的值，用于衡量二分类（正类和负类）问题中模型的性能。MCC考虑了真正例、假正例、真负例和假负例，因此即使类别不平衡时也是一个很好的性能度量。

精确率（Precision）：表示被正确预测为正类的样本数占所有被预测为正类的样本数的比例。它反映了模型预测正类的准确性。

召回率（Recall）：表示被正确预测为正类的样本数占所有真实正类的样本数的比例。它反映了模型找出正类样本的能力。

F分数（F-Score）：是精确率和召回率的加权调和平均，用于同时考虑精确率和召回率的指标。通过调整β值，可以控制精确率对F分数的影响大于、小于或等于召回率的影响。

平均F分数（Averaged F-Score）：是在多类分类问题中，对每个类别计算F分数，然后取平均值的结果。这里的平均方法是宏平均（Macro Average），即简单地计算各类别F分数的算术平均值。

"""
import random
from typing import Optional, Sequence, Set

import numpy as np

from evals.record import Event


def get_accuracy(events: Sequence[Event]) -> float:
    num_correct = sum(int(event.data["correct"]) for event in events)
    num_total = len(events)
    if num_total == 0:
        return float("nan")
    else:
        return num_correct / num_total


def get_bootstrap_accuracy_std(events: Sequence[Event], num_samples: int = 1000) -> float:
    vals = [m.data["correct"] for m in events]
    return np.std([np.mean(random.sample(vals, len(vals) // 2)) for _ in range(num_samples)])


def get_confusion_matrix(
    matches: Sequence[Event], class_labels: Optional[Set] = None
) -> np.ndarray:
    labels = {match.data["expected"] for match in matches}
    if class_labels is None:
        labels = {label: i for i, label in enumerate(sorted(labels))}
    else:
        assert labels.issubset(class_labels)
        labels = {label: i for i, label in enumerate(class_labels)}
    result = np.zeros((len(labels), len(labels) + 1), dtype=int)
    for match in matches:
        i = labels[match.data["expected"]]
        j = labels.get(match.data["picked"], len(labels))
        result[i, j] += 1
    return result


def compute_matthew_corr(confusion_matrix: np.ndarray) -> float:
    assert confusion_matrix.shape == (2, 3), f"Got shape: {confusion_matrix.shape}"
    r = confusion_matrix[:, :2]
    r[:, 0] += confusion_matrix[:, 2]
    return (r[1, 1] * r[0, 0] - r[1, 0] * r[0, 1]) / np.sqrt(
        r[1, :].sum() * r[0, :].sum() * r[:, 0].sum() * r[:, 1].sum()
    )


def compute_precision(confusion_matrix: np.ndarray, idx: int = 0) -> float:
    return confusion_matrix[idx, idx] / confusion_matrix[:, idx].sum()


def compute_recall(confusion_matrix: np.ndarray, idx: int = 0) -> float:
    return confusion_matrix[idx, idx] / confusion_matrix[idx, :].sum()


def compute_f_score(confusion_matrix: np.ndarray, idx: int = 0, beta: float = 1.0) -> float:
    precision = compute_precision(confusion_matrix, idx=idx)
    recall = compute_recall(confusion_matrix, idx=idx)
    return (1 + beta**2) * (precision * recall) / (beta**2 * precision + recall)


def compute_averaged_f_score(
    confusion_matrix: np.ndarray, beta: float = 1.0, average: str = "macro"
) -> float:
    assert average in ["macro"]
    f_scores = []
    for i in range(confusion_matrix.shape[0]):
        f_scores.append(compute_f_score(confusion_matrix, idx=i, beta=beta))
    return np.array(f_scores).mean()
