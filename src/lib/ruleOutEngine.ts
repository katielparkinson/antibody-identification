import { antibodies } from "./antibodyPolicy";
import type {
  Antibody,
  AntibodyEvaluation,
  AntibodyProofStatus,
  DonorCell,
  PracticeCase,
  ReactionValue,
  ProofMark,
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

const getProofSupportMark = (
  cell: DonorCell,
  caseData: PracticeCase,
  antibody: Antibody,
): Exclude<ProofMark, "none"> | undefined => {
  if (cell.isAutoControl) {
    return undefined;
  }

  const antigen = cell.antigens[antibody.antigenId];
  const reactive = isReactive(caseData.reactions[cell.id]);

  if (antigen === "positive" && reactive) {
    return "positive";
  }

  if (antigen === "negative" && !reactive) {
    return "negative";
  }

  return undefined;
};

export const calculateRuleOutStatus = (
  heterozygousCount: number,
  homozygousCount: number,
): "unmarked" | "partial" | "ruled-out" => {
  if (homozygousCount >= 2 || (heterozygousCount >= 2 && homozygousCount >= 1)) {
    return "ruled-out";
  }

  if (heterozygousCount > 0 || homozygousCount > 0) {
    return "partial";
  }

  return "unmarked";
};

export const calculateRuleInStatus = (
  antibody: Antibody,
  caseData: PracticeCase,
): AntibodyProofStatus => {
  const positiveSupport = caseData.cells.filter(
    (cell) =>
      !cell.isAutoControl &&
      cell.antigens[antibody.antigenId] === "positive" &&
      isReactive(caseData.reactions[cell.id]),
  ).length;
  const negativeSupport = caseData.cells.filter(
    (cell) =>
      !cell.isAutoControl &&
      cell.antigens[antibody.antigenId] === "negative" &&
      !isReactive(caseData.reactions[cell.id]),
  ).length;

  return positiveSupport >= 3 && negativeSupport >= 3 ? "proven" : "unproven";
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

export const cycleProofMark = (current: ProofMark): ProofMark => {
  if (current === "none") {
    return "positive";
  }

  if (current === "positive") {
    return "negative";
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

export const getSuggestedProofMark = (
  cell: DonorCell,
  caseData: PracticeCase,
  antibody: Antibody,
): ProofMark => {
  const supportMark = getProofSupportMark(cell, caseData, antibody);
  return supportMark ?? "none";
};

export const createProofAnswerMarks = (
  caseData: PracticeCase,
  antibody: Antibody,
): Record<string, ProofMark> =>
  caseData.cells.reduce<Record<string, ProofMark>>((cellMarks, cell) => {
    const mark = getSuggestedProofMark(cell, caseData, antibody);
    if (mark !== "none") {
      cellMarks[cell.id] = mark;
    }
    return cellMarks;
  }, {});

export const evaluateProofSelection = (
  caseData: PracticeCase,
  antibody: Antibody,
  proofMarks: Record<string, ProofMark>,
) => {
  const positiveSupports: string[] = [];
  const negativeSupports: string[] = [];

  for (const [cellId, mark] of Object.entries(proofMarks)) {
    const cell = caseData.cells.find((candidate) => candidate.id === cellId);
    if (!cell || cell.isAutoControl) {
      continue;
    }

    const supportMark = getProofSupportMark(cell, caseData, antibody);
    if (supportMark === mark && mark === "positive") {
      positiveSupports.push(cellId);
    } else if (supportMark === mark && mark === "negative") {
      negativeSupports.push(cellId);
    }
  }

  const status = positiveSupports.length >= 3 && negativeSupports.length >= 3 ? "proven" : "unproven";

  return {
    antibodyId: antibody.id,
    status,
    positiveSupports,
    negativeSupports,
    explanation:
      status === "proven"
        ? `${antibody.label} is proven by three positive and three negative supports.`
        : `${antibody.label} does not yet have enough proof support.`,
  };
};

export const evaluateAntibody = (
  antibody: Antibody,
  caseData: PracticeCase,
  userMarks: UserMarks,
): AntibodyEvaluation => {
  const marks = userMarks[antibody.id] ?? {};
  const heterozygousRuleOuts: string[] = [];
  const homozygousRuleOuts: string[] = [];

  for (const [cellId, mark] of Object.entries(marks)) {
    const cell = caseData.cells.find((candidate) => candidate.id === cellId);
    if (!cell || cell.isAutoControl) {
      continue;
    }

    if (mark === "heterozygous") {
      heterozygousRuleOuts.push(cellId);
    } else if (mark === "homozygous") {
      homozygousRuleOuts.push(cellId);
    }
  }

  const status = calculateRuleOutStatus(heterozygousRuleOuts.length, homozygousRuleOuts.length);

  return {
    antibodyId: antibody.id,
    status,
    proofStatus: calculateRuleInStatus(antibody, caseData),
    heterozygousRuleOuts,
    homozygousRuleOuts,
    explanation:
      status === "ruled-out"
        ? `${antibody.label} is ruled out by your entered rule-out marks.`
        : status === "partial"
          ? `${antibody.label} has some entered rule-out marks, but not enough to fully rule it out yet.`
          : `${antibody.label} has not been ruled out by your marks.`,
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
