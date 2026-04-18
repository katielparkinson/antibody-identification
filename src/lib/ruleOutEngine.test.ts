import { describe, expect, it } from "vitest";
import { antibodyById } from "./antibodyPolicy";
import { practiceCases } from "./practiceCases";
import {
  createAnswerKeyMarks,
  evaluateAntibody,
  getSuggestedMark,
  summarizeEvaluation,
} from "./ruleOutEngine";

const caseData = practiceCases[0];

describe("rule-out engine", () => {
  it("does not suggest rule-out marks from reactive cells", () => {
    const antiE = antibodyById.get("anti-E");
    const reactiveCell = caseData.cells.find((cell) => cell.id === "cell-3");

    expect(antiE).toBeDefined();
    expect(reactiveCell).toBeDefined();
    expect(getSuggestedMark(reactiveCell!, caseData, antiE!)).toBe("none");
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

  it("leaves the target antibody possible in the answer key", () => {
    const marks = createAnswerKeyMarks(caseData);
    const summary = summarizeEvaluation(caseData, marks);

    expect(summary.possible).toEqual(["anti-E"]);
    expect(summary.ruledOut).toBeGreaterThan(10);
  });
});
