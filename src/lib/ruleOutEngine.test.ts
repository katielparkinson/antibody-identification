import { describe, expect, it } from "vitest";
import { antibodies, antibodyById, antigenGroups, antigens } from "./antibodyPolicy";
import { practiceCases } from "./practiceCases";
import {
  calculateRuleInStatus,
  calculateRuleOutStatus,
  createAnswerKeyMarks,
  cycleRuleOutMark,
  evaluateAntibody,
  getSuggestedMark,
  summarizeEvaluation,
} from "./ruleOutEngine";
import { inferCellZygosity } from "./zygosity";
import type { DonorCell, PracticeCase, ReactionValue } from "./types";

const makeCell = (
  id: string,
  antigenId: string,
  zygosity: "homozygous" | "heterozygous",
): DonorCell => ({
  id,
  label: id,
  antigens: {
    [antigenId]: "positive",
  },
  zygosity: {
    [antigenId]: zygosity,
  },
});

const makeTypedCell = (
  id: string,
  antigenId: string,
  antigenValue: "positive" | "negative",
  zygosity: "homozygous" | "heterozygous" | "not_applicable",
): DonorCell => ({
  id,
  label: id,
  antigens: {
    [antigenId]: antigenValue,
  },
  zygosity: {
    [antigenId]: zygosity,
  },
});

const makeCase = (
  cells: DonorCell[],
  reactions: Record<string, ReactionValue>,
  targetAntibodyId = "anti-E",
): PracticeCase => ({
  id: "test-case",
  title: "Test Case",
  summary: "Synthetic test case",
  targetAntibodyId,
  cells,
  reactions,
});

describe("rule-out engine", () => {
  it("marks only C, c, E, e, Fya, Fyb, Jka, Jkb, M, N, S, and s as dosage sensitive", () => {
    expect(antibodies.filter((antibody) => antibody.dosageSensitive).map((antibody) => antibody.id)).toEqual([
      "anti-C",
      "anti-c",
      "anti-E",
      "anti-e",
      "anti-Fya",
      "anti-Fyb",
      "anti-Jka",
      "anti-Jkb",
      "anti-M",
      "anti-N",
      "anti-S",
      "anti-s",
    ]);
  });

  it("infers heterozygous and homozygous states from antigen patterns", () => {
    expect(
      inferCellZygosity({
        C: "positive",
        c: "positive",
        e: "positive",
        K: "negative",
      }),
    ).toMatchObject({
      C: "heterozygous",
      c: "heterozygous",
      e: "homozygous",
      K: "not_applicable",
    });

    expect(
      inferCellZygosity({
        E: "negative",
        e: "positive",
        C: "negative",
        c: "negative",
      }),
    ).toMatchObject({
      E: "not_applicable",
      e: "homozygous",
      C: "not_applicable",
      c: "not_applicable",
    });
  });

  it("uses the practice case inference so reveal marks show homozygous for cell 1 anti-e and cell 2 anti-C", () => {
    const answerMarks = createAnswerKeyMarks(practiceCases[0]);

    expect(answerMarks["anti-e"]?.["cell-1"]).toBe("homozygous");
    expect(answerMarks["anti-C"]?.["cell-2"]).toBe("homozygous");
  });

  it("exposes four practice cases with the expected target summaries", () => {
    expect(practiceCases.map((practiceCase) => practiceCase.title)).toEqual([
      "Case 1",
      "Case 2",
      "Case 3",
      "Case 4",
    ]);

    expect(practiceCases.map((practiceCase) => practiceCase.summary)).toEqual([
      "Synthetic panel with IAT reactivity consistent with anti-E.",
      "Synthetic panel with IAT reactivity consistent with anti-Fya.",
      "Synthetic panel with IAT reactivity consistent with anti-D.",
      "Synthetic panel with IAT reactivity consistent with anti-Jkb.",
    ]);
  });

  it("derives the new cases' zygosity patterns from their antigen maps", () => {
    expect(practiceCases[1].cells.find((cell) => cell.id === "cell-1")?.zygosity).toMatchObject({
      Fya: "heterozygous",
      Fyb: "heterozygous",
    });

    expect(practiceCases[2].cells.find((cell) => cell.id === "cell-1")?.zygosity).toMatchObject({
      D: "homozygous",
    });

    expect(practiceCases[3].cells.find((cell) => cell.id === "cell-2")?.zygosity).toMatchObject({
      Jka: "heterozygous",
      Jkb: "heterozygous",
    });
  });

  it("leaves the autocontrol without antigen typing", () => {
    expect(practiceCases[0].cells.find((cell) => cell.id === "auto")?.antigens).toEqual({});
    expect(practiceCases[0].cells.find((cell) => cell.id === "auto")?.zygosity).toEqual({});
  });

  it("keeps autocontrol antigen display blank by omitting antigen typings", () => {
    const autoCell = practiceCases[0].cells.find((cell) => cell.id === "auto");

    expect(autoCell).toBeDefined();
    expect(autoCell?.isAutoControl).toBe(true);
    expect(Object.keys(autoCell?.antigens ?? {})).toHaveLength(0);
  });

  it("counts user-entered marks on non-dosage-sensitive antibodies as entered", () => {
    const antiD = antibodyById.get("anti-D")!;
    const caseData = makeCase([makeCell("cell-1", "D", "heterozygous")], { "cell-1": "0" });

    const evaluation = evaluateAntibody(antiD, caseData, {
      "anti-D": {
        "cell-1": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("partial");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-1"]);
    expect(evaluation.homozygousRuleOuts).toEqual([]);
    expect(evaluation.proofStatus).toBe("unproven");
  });

  it("allows reactive cells to be clicked without treating them as answer-key suggestions", () => {
    const antiE = antibodyById.get("anti-E");
    const reactiveCell = practiceCases[0].cells.find((cell) => cell.id === "cell-3");

    expect(antiE).toBeDefined();
    expect(reactiveCell).toBeDefined();
    expect(getSuggestedMark(reactiveCell!, practiceCases[0], antiE!)).toBe("none");
  });

  it("cycles blank, heterozygous, and homozygous rule-out marks", () => {
    expect(cycleRuleOutMark("none")).toBe("heterozygous");
    expect(cycleRuleOutMark("heterozygous")).toBe("homozygous");
    expect(cycleRuleOutMark("homozygous")).toBe("none");
  });

  it("treats heterozygous evidence as partial for dosage-sensitive antibodies", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase([makeCell("cell-1", "E", "heterozygous")], { "cell-1": "0" });

    const evaluation = evaluateAntibody(antiE, caseData, {
      "anti-E": {
        "cell-1": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("partial");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-1"]);
    expect(evaluation.homozygousRuleOuts).toEqual([]);
  });

  it("rules out dosage-sensitive antibodies after two homozygous rule outs", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase(
      [
        makeCell("cell-1", "E", "homozygous"),
        makeCell("cell-2", "E", "homozygous"),
        makeCell("cell-3", "E", "heterozygous"),
      ],
      {
        "cell-1": "0",
        "cell-2": "0",
        "cell-3": "0",
      },
    );

    const evaluation = evaluateAntibody(antiE, caseData, {
      "anti-E": {
        "cell-1": "homozygous",
        "cell-2": "homozygous",
        "cell-3": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.homozygousRuleOuts).toEqual(["cell-1", "cell-2"]);
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-3"]);
  });

  it("rules out when there are two heterozygous rule outs and one homozygous rule out", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase(
      [
        makeCell("cell-1", "E", "heterozygous"),
        makeCell("cell-2", "E", "heterozygous"),
        makeCell("cell-3", "E", "homozygous"),
      ],
      {
        "cell-1": "0",
        "cell-2": "0",
        "cell-3": "0",
      },
    );

    const evaluation = evaluateAntibody(antiE, caseData, {
      "anti-E": {
        "cell-1": "heterozygous",
        "cell-2": "heterozygous",
        "cell-3": "homozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-1", "cell-2"]);
    expect(evaluation.homozygousRuleOuts).toEqual(["cell-3"]);
  });

  it("treats one user-entered mark on a non-dosage-sensitive antibody as partial", () => {
    const antiK = antibodyById.get("anti-K")!;
    const caseData = makeCase([makeCell("cell-1", "K", "heterozygous")], { "cell-1": "0" });

    const evaluation = evaluateAntibody(antiK, caseData, {
      "anti-K": {
        "cell-1": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("partial");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-1"]);
    expect(evaluation.homozygousRuleOuts).toEqual([]);
  });

  it("counts the user's rule-out marks even when they do not match the cell zygosity or reactivity", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase(
      [
        makeCell("cell-1", "E", "heterozygous"),
        makeTypedCell("cell-2", "E", "negative", "not_applicable"),
      ],
      {
        "cell-1": "2+",
        "cell-2": "0",
      },
    );

    const evaluation = evaluateAntibody(antiE, caseData, {
      "anti-E": {
        "cell-1": "homozygous",
        "cell-2": "homozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.homozygousRuleOuts).toEqual(["cell-1", "cell-2"]);
  });

  it("starts all antibodies as unmarked before user rule-outs", () => {
    const summary = summarizeEvaluation(practiceCases[0], {});

    expect(summary.ruledOut).toBe(0);
    expect(summary.partial).toBe(0);
  });

  it("calculates rule-out status from the threshold rules", () => {
    expect(calculateRuleOutStatus(0, 0)).toBe("unmarked");
    expect(calculateRuleOutStatus(1, 0)).toBe("partial");
    expect(calculateRuleOutStatus(0, 2)).toBe("ruled-out");
    expect(calculateRuleOutStatus(2, 1)).toBe("ruled-out");
  });

  it("proves an antibody only when it has three positive and three negative supports", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase(
      [
        makeTypedCell("cell-1", "E", "positive", "homozygous"),
        makeTypedCell("cell-2", "E", "positive", "homozygous"),
        makeTypedCell("cell-3", "E", "positive", "homozygous"),
        makeTypedCell("cell-4", "E", "negative", "not_applicable"),
        makeTypedCell("cell-5", "E", "negative", "not_applicable"),
        makeTypedCell("cell-6", "E", "negative", "not_applicable"),
      ],
      {
        "cell-1": "2+",
        "cell-2": "1+",
        "cell-3": "w+",
        "cell-4": "0",
        "cell-5": "0",
        "cell-6": "0",
      },
    );

    expect(calculateRuleInStatus(antiE, caseData)).toBe("proven");
    expect(evaluateAntibody(antiE, caseData, {}).proofStatus).toBe("proven");
  });

  it("includes the added minor antigens in the panel library", () => {
    expect(antibodies.map((antibody) => antibody.id)).toEqual(
      expect.arrayContaining([
        "anti-Cw",
        "anti-V",
        "anti-Kpa",
        "anti-Kpb",
        "anti-Jsa",
        "anti-Jsb",
        "anti-Lua",
        "anti-Lub",
      ]),
    );
  });

  it("orders the panel with field-style family groupings", () => {
    expect(antigenGroups.map((group) => group.label)).toEqual([
      "Rh-Hr",
      "Kell",
      "Duffy",
      "Kidd",
      "Lewis",
      "P",
      "MNS",
      "Lutheran",
    ]);

    expect(antigens.slice(0, 7).map((antigen) => antigen.id)).toEqual([
      "D",
      "C",
      "c",
      "E",
      "e",
      "Cw",
      "V",
    ]);
  });

  it("builds answer key marks from valid nonreactive evidence only", () => {
    const marks = createAnswerKeyMarks(practiceCases[0]);
    const summary = summarizeEvaluation(practiceCases[0], marks);

    expect(summary.ruledOut).toBeGreaterThan(10);
    expect(Object.keys(marks).length).toBeGreaterThan(0);
  });
});
