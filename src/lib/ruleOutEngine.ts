import { antibodies } from "./antibodyPolicy";
import type {
  Antibody,
  AntibodyEvaluation,
  DonorCell,
  PracticeCase,
  ReactionValue,
  RuleOutMark,
  UserMarks,
} from "./types";

const reactiveValues = new Set<ReactionValue>(["w+", "1+", "2+", "3+", "4+", "mf"]);

export const isReactive = (reaction: ReactionValue | undefined) =>
  reaction !== undefined && reactiveValues.has(reaction);

const isRuleOutEligible = (cell: DonorCell, caseData: PracticeCase, antibody: Antibody) =>
  !cell.isAutoControl &&
  !isReactive(caseData.reactions[cell.id]) &&
  cell.antigens[antibody.antigenId] === "positive";

export const canMarkRuleOut = (cell: DonorCell, caseData: PracticeCase, antibody: Antibody) =>
  isRuleOutEligible(cell, caseData, antibody);

export const cycleRuleOutMark = (current: RuleOutMark): RuleOutMark => {
  if (current === "none") {
    return "heterozygous";
  }

  if (current === "heterozygous") {
    return "homozygous";
  }

  return "none";
};

export const getSuggestedMark = (
  cell: DonorCell,
  caseData: PracticeCase,
  antibody: Antibody,
): RuleOutMark => {
  if (!isRuleOutEligible(cell, caseData, antibody)) {
    return "none";
  }

  if (!antibody.dosageSensitive) {
    return "homozygous";
  }

  const zygosity = cell.zygosity[antibody.antigenId];
  if (zygosity === "homozygous") {
    return "homozygous";
  }

  if (zygosity === "heterozygous") {
    return "heterozygous";
  }

  return "none";
};

export const evaluateAntibody = (
  antibody: Antibody,
  caseData: PracticeCase,
  userMarks: UserMarks,
): AntibodyEvaluation => {
  const marks = userMarks[antibody.id] ?? {};
  const heterozygousRuleOuts = Object.entries(marks)
    .filter(([, mark]) => mark === "heterozygous")
    .map(([cellId]) => cellId);
  const homozygousRuleOuts = Object.entries(marks)
    .filter(([, mark]) => mark === "homozygous")
    .map(([cellId]) => cellId);

  if (homozygousRuleOuts.length > 0) {
    return {
      antibodyId: antibody.id,
      status: "ruled-out",
      heterozygousRuleOuts,
      homozygousRuleOuts,
      explanation: `${antibody.label} is ruled out by nonreactive antigen-positive cell evidence.`,
    };
  }

  if (heterozygousRuleOuts.length > 0) {
    return {
      antibodyId: antibody.id,
      status: "partial",
      heterozygousRuleOuts,
      homozygousRuleOuts,
      explanation: `${antibody.label} has only heterozygous rule-out evidence, so it remains incomplete for dosage-sensitive policy.`,
    };
  }

  if (caseData.targetAntibodies.includes(antibody.id)) {
    return {
      antibodyId: antibody.id,
      status: "possible",
      heterozygousRuleOuts,
      homozygousRuleOuts,
      explanation: `${antibody.label} still fits this reaction pattern.`,
    };
  }

  return {
    antibodyId: antibody.id,
    status: "unmarked",
    heterozygousRuleOuts,
    homozygousRuleOuts,
    explanation: `${antibody.label} has not been ruled out yet.`,
  };
};

export const evaluatePanel = (caseData: PracticeCase, userMarks: UserMarks) =>
  antibodies.map((antibody) => evaluateAntibody(antibody, caseData, userMarks));

export const createAnswerKeyMarks = (caseData: PracticeCase): UserMarks =>
  antibodies.reduce<UserMarks>((marks, antibody) => {
    const antibodyMarks = caseData.cells.reduce<Record<string, RuleOutMark>>((cellMarks, cell) => {
      const mark = getSuggestedMark(cell, caseData, antibody);
      if (mark !== "none") {
        cellMarks[cell.id] = mark;
      }
      return cellMarks;
    }, {});

    if (Object.keys(antibodyMarks).length > 0) {
      marks[antibody.id] = antibodyMarks;
    }

    return marks;
  }, {});

export const summarizeEvaluation = (caseData: PracticeCase, userMarks: UserMarks) => {
  const evaluations = evaluatePanel(caseData, userMarks);

  return {
    ruledOut: evaluations.filter((item) => item.status === "ruled-out").length,
    partial: evaluations.filter((item) => item.status === "partial").length,
    possible: evaluations.filter((item) => item.status === "possible").map((item) => item.antibodyId),
  };
};
