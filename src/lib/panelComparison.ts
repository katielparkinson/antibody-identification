import type { AntibodyStatus, ManualStatus, ProofMark, UserMarks } from "./types";

export const manualStatusLabels: Record<ManualStatus, string> = {
  none: "",
  suspect: "Suspect",
  partial: "Partial",
  "ruled-out": "Out",
};

export const cycleManualStatus = (current: ManualStatus): ManualStatus => {
  if (current === "none") {
    return "partial";
  }

  if (current === "partial") {
    return "ruled-out";
  }

  if (current === "ruled-out") {
    return "suspect";
  }

  return "none";
};

export const summarizeManualStatuses = (statuses: Record<string, ManualStatus>) =>
  Object.values(statuses).reduce(
    (summary, status) => {
      if (status === "suspect") {
        summary.suspect += 1;
      } else if (status === "partial") {
        summary.partial += 1;
      } else if (status === "ruled-out") {
        summary.ruledOut += 1;
      }

      return summary;
    },
    {
      suspect: 0,
      partial: 0,
      ruledOut: 0,
    },
  );

export const manualStatusFromEvaluation = (status: AntibodyStatus): Exclude<ManualStatus, "suspect"> =>
  status === "partial" ? "partial" : status === "ruled-out" ? "ruled-out" : "none";

export const countStatusDifferences = (
  userStatuses: Record<string, ManualStatus>,
  answerStatuses: Record<string, ManualStatus>,
) => {
  const keys = new Set([...Object.keys(userStatuses), ...Object.keys(answerStatuses)]);

  return Array.from(keys).reduce((count, antibodyId) => {
    const userStatus = userStatuses[antibodyId] ?? "none";
    const answerStatus = answerStatuses[antibodyId] ?? "none";

    if (userStatus === "none") {
      return count;
    }

    if (userStatus !== answerStatus) {
      return count + 1;
    }

    return count;
  }, 0);
};

export const countRuleOutDifferences = (userMarks: UserMarks, answerMarks: UserMarks) => {
  const antibodyIds = new Set([...Object.keys(userMarks), ...Object.keys(answerMarks)]);

  return Array.from(antibodyIds).reduce((count, antibodyId) => {
    const userAntibodyMarks = userMarks[antibodyId] ?? {};
    const answerAntibodyMarks = answerMarks[antibodyId] ?? {};
    const cellIds = new Set([...Object.keys(userAntibodyMarks), ...Object.keys(answerAntibodyMarks)]);

    const differences = Array.from(cellIds).filter((cellId) => {
      const userMark = userAntibodyMarks[cellId] ?? "none";
      const answerMark = answerAntibodyMarks[cellId] ?? "none";
      return userMark !== answerMark && (userMark !== "none" || answerMark !== "none");
    }).length;

    return count + differences;
  }, 0);
};

export const countProofDifferences = (
  userProofMarks: Record<string, ProofMark>,
  answerProofMarks: Record<string, ProofMark>,
) => {
  const cellIds = new Set([...Object.keys(userProofMarks), ...Object.keys(answerProofMarks)]);

  return Array.from(cellIds).reduce((count, cellId) => {
    const userMark = userProofMarks[cellId] ?? "none";
    const answerMark = answerProofMarks[cellId] ?? "none";

    if (userMark !== answerMark && (userMark !== "none" || answerMark !== "none")) {
      return count + 1;
    }

    return count;
  }, 0);
};
