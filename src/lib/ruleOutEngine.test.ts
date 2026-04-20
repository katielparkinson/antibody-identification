import { describe, expect, it } from "vitest";
import { antibodies, antibodyById, antigenGroups, antigens } from "./antibodyPolicy";
import { practiceCases } from "./practiceCases";
import {
  canMarkRuleOut,
  createAnswerKeyMarks,
  cycleRuleOutMark,
  evaluateAntibody,
  getSuggestedMark,
  summarizeEvaluation,
} from "./ruleOutEngine";

const caseData = practiceCases[0];

describe("rule-out engine", () => {
  it("allows reactive cells to be clicked without treating them as answer-key suggestions", () => {
    const antiE = antibodyById.get("anti-E");
    const reactiveCell = caseData.cells.find((cell) => cell.id === "cell-3");

    expect(antiE).toBeDefined();
    expect(reactiveCell).toBeDefined();
    expect(getSuggestedMark(reactiveCell!, caseData, antiE!)).toBe("none");
    expect(canMarkRuleOut(reactiveCell!, caseData, antiE!)).toBe(true);
  });

  it("allows users to cycle dosage choices manually", () => {
    expect(cycleRuleOutMark("none")).toBe("heterozygous");
    expect(cycleRuleOutMark("heterozygous")).toBe("homozygous");
    expect(cycleRuleOutMark("homozygous")).toBe("none");
  });

  it("allows marking nonreactive antigen-positive cells even when the answer is homozygous", () => {
    const antiC = antibodyById.get("anti-C");
    const homozygousCell = caseData.cells.find((cell) => cell.id === "cell-1");

    expect(antiC).toBeDefined();
    expect(homozygousCell).toBeDefined();
    expect(getSuggestedMark(homozygousCell!, caseData, antiC!)).toBe("homozygous");
    expect(canMarkRuleOut(homozygousCell!, caseData, antiC!)).toBe(true);
  });

  it("separates heterozygous and homozygous rule-out evidence", () => {
    const antiC = antibodyById.get("anti-C");
    const heterozygousCell = caseData.cells.find((cell) => cell.id === "cell-10");
    const homozygousCell = caseData.cells.find((cell) => cell.id === "cell-1");

    expect(antiC).toBeDefined();
    expect(getSuggestedMark(heterozygousCell!, caseData, antiC!)).toBe("heterozygous");
    expect(getSuggestedMark(homozygousCell!, caseData, antiC!)).toBe("homozygous");
  });

  it("treats heterozygous evidence as partial for dosage-sensitive antibodies", () => {
    const antiC = antibodyById.get("anti-C")!;
    const evaluation = evaluateAntibody(antiC, caseData, {
      "anti-C": {
        "cell-10": "heterozygous",
      },
    });

    expect(evaluation.status).toBe("partial");
    expect(evaluation.heterozygousRuleOuts).toEqual(["cell-10"]);
  });

  it("marks dosage-sensitive antibodies ruled out when homozygous evidence is present", () => {
    const antiC = antibodyById.get("anti-C")!;
    const evaluation = evaluateAntibody(antiC, caseData, {
      "anti-C": {
        "cell-1": "homozygous",
      },
    });

    expect(evaluation.status).toBe("ruled-out");
    expect(evaluation.homozygousRuleOuts).toEqual(["cell-1"]);
  });

  it("starts all antibodies as possible before user rule-outs", () => {
    const summary = summarizeEvaluation(caseData, {});

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

  it("leaves the target antibody possible in the answer key", () => {
    const marks = createAnswerKeyMarks(caseData);
    const summary = summarizeEvaluation(caseData, marks);

    expect(summary.ruledOut).toBeGreaterThan(10);
  });
});
