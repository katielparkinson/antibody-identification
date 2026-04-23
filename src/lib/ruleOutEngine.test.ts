import { describe, expect, it } from "vitest";
import { antibodies, antibodyById, antigenGroups, antigens } from "./antibodyPolicy";
import { practiceCases } from "./practiceCases";
import {
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

const makeCase = (cells: DonorCell[], reactions: Record<string, ReactionValue>): PracticeCase => ({
  id: "test-case",
  title: "Test Case",
  summary: "Synthetic test case",
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

  it("treats Rh exceptions like D as non-dosage-sensitive", () => {
    const antiD = antibodyById.get("anti-D")!;
    const caseData = makeCase([makeCell("cell-1", "D", "heterozygous")], { "cell-1": "0" });

    const evaluation = evaluateAntibody(antiD, caseData, {
      "anti-D": {
        "cell-1": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-1"]);
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

  it("marks dosage-sensitive antibodies ruled out only when the marked cell is homozygous and nonreactive", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase(
      [
        makeCell("cell-1", "E", "homozygous"),
        makeCell("cell-2", "E", "heterozygous"),
        makeCell("cell-3", "E", "homozygous"),
      ],
      {
        "cell-1": "0",
        "cell-2": "0",
        "cell-3": "2+",
      },
    );

    const evaluation = evaluateAntibody(antiE, caseData, {
      "anti-E": {
        "cell-1": "homozygous",
        "cell-2": "heterozygous",
        "cell-3": "homozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.homozygousRuleOuts).toEqual(["cell-1"]);
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-2"]);
  });

  it("treats non-dosage-sensitive antibodies as ruled out by any valid marked antigen-positive nonreactive cell", () => {
    const antiK = antibodyById.get("anti-K")!;
    const caseData = makeCase([makeCell("cell-1", "K", "heterozygous")], { "cell-1": "0" });

    const evaluation = evaluateAntibody(antiK, caseData, {
      "anti-K": {
        "cell-1": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-1"]);
    expect(evaluation.homozygousRuleOuts).toEqual([]);
  });

  it("ignores marks on reactive cells", () => {
    const antiE = antibodyById.get("anti-E")!;
    const caseData = makeCase([makeCell("cell-1", "E", "homozygous")], { "cell-1": "2+" });

    const evaluation = evaluateAntibody(antiE, caseData, {
      "anti-E": {
        "cell-1": "homozygous",
      },
    });

    expect(evaluation.status).toBe("unmarked");
    expect(evaluation.homozygousRuleOuts).toEqual([]);
  });

  it("starts all antibodies as unmarked before user rule-outs", () => {
    const summary = summarizeEvaluation(practiceCases[0], {});

    expect(summary.ruledOut).toBe(0);
    expect(summary.partial).toBe(0);
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
