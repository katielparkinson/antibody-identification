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

const isRuleOutEligible = (cell: DonorCell, antibody: Antibody) =>
  !cell.isAutoControl && cell.antigens[antibody.antigenId] === "positive";

const isSuggestedRuleOutCell = (cell: DonorCell, caseData: PracticeCase, antibody: Antibody) =>
  isRuleOutEligible(cell, antibody) && !isReactive(caseData.reactions[cell.id]);

const getValidRuleOutCell = (caseData: PracticeCase, cellId: string, antibody: Antibody) => {
  const cell = caseData.cells.find((candidate) => candidate.id === cellId);
  if (!cell || !isRuleOutEligible(cell, antibody)) {
    return undefined;
  }

  if (isReactive(caseData.reactions[cell.id])) {
    return undefined;
  }

  return cell;
};

export const canMarkRuleOut = (cell: DonorCell, antibody: Antibody) => isRuleOutEligible(cell, antibody);

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
  if (!isSuggestedRuleOutCell(cell, caseData, antibody)) {
    return "none";
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
    .filter(([cellId, mark]) => {
      if (mark !== "heterozygous") {
        return false;
      }

      const cell = getValidRuleOutCell(caseData, cellId, antibody);
      if (!cell) {
        return false;
      }

      if (!antibody.dosageSensitive) {
        return true;
      }

      return cell.zygosity[antibody.antigenId] === "heterozygous";
    })
    .map(([cellId]) => cellId);
  const homozygousRuleOuts = Object.entries(marks)
    .filter(([cellId, mark]) => {
      if (mark !== "homozygous") {
        return false;
      }

      const cell = getValidRuleOutCell(caseData, cellId, antibody);
      if (!cell) {
        return false;
      }

      if (!antibody.dosageSensitive) {
        return true;
      }

      return cell.zygosity[antibody.antigenId] === "homozygous";
    })
    .map(([cellId]) => cellId);

  if (homozygousRuleOuts.length > 0) {
    return {
      antibodyId: antibody.id,
      status: "ruled-out",
      heterozygousRuleOuts,
      homozygousRuleOuts,
      explanation: `${antibody.label} is ruled out by valid nonreactive antigen-positive cell evidence.`,
    };
  }

  if (heterozygousRuleOuts.length > 0) {
    return {
      antibodyId: antibody.id,
      status: antibody.dosageSensitive ? "partial" : "ruled-out",
      heterozygousRuleOuts,
      homozygousRuleOuts,
      explanation: antibody.dosageSensitive
        ? `${antibody.label} has only heterozygous rule-out evidence, so it remains partial under dosage-sensitive policy.`
        : `${antibody.label} is ruled out by a valid nonreactive antigen-positive cell.`,
    };
  }

  return {
    antibodyId: antibody.id,
    status: "unmarked",
    heterozygousRuleOuts,
    homozygousRuleOuts,
    explanation: `${antibody.label} has not been ruled out by your marks.`,
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
  };
};
