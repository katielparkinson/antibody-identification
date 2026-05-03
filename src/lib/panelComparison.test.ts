import { describe, expect, it } from "vitest";
import {
  countProofDifferences,
  countRuleOutDifferences,
  countStatusDifferences,
  cycleManualStatus,
  manualStatusFromEvaluation,
  summarizeManualStatuses,
} from "./panelComparison";
import type { ProofMark, UserMarks } from "./types";

describe("panel comparison helpers", () => {
  it("cycles manual status marks in the expected order", () => {
    expect(cycleManualStatus("none")).toBe("partial");
    expect(cycleManualStatus("partial")).toBe("ruled-out");
    expect(cycleManualStatus("ruled-out")).toBe("suspect");
    expect(cycleManualStatus("suspect")).toBe("none");
  });

  it("summarizes manual status counts", () => {
    expect(
      summarizeManualStatuses({
        "anti-E": "partial",
        "anti-Fya": "ruled-out",
        "anti-Jkb": "suspect",
        "anti-D": "none",
      }),
    ).toEqual({
      suspect: 1,
      partial: 1,
      ruledOut: 1,
    });
  });

  it("maps evaluation statuses to the manual display states", () => {
    expect(manualStatusFromEvaluation("unmarked")).toBe("none");
    expect(manualStatusFromEvaluation("partial")).toBe("partial");
    expect(manualStatusFromEvaluation("ruled-out")).toBe("ruled-out");
  });

  it("counts status differences across the antibody footer", () => {
    expect(
      countStatusDifferences(
        {
          "anti-E": "partial",
          "anti-Fya": "suspect",
        },
        {
          "anti-E": "partial",
          "anti-Fya": "ruled-out",
        },
      ),
    ).toBe(1);
  });

  it("ignores untouched blank statuses when counting differences", () => {
    expect(
      countStatusDifferences(
        {
          "anti-E": "none",
        },
        {
          "anti-E": "ruled-out",
        },
      ),
    ).toBe(0);
  });

  it("counts rule-out differences across antibody cells", () => {
    const userMarks: UserMarks = {
      "anti-E": {
        "cell-1": "heterozygous",
        "cell-2": "homozygous",
      },
    };
    const answerMarks: UserMarks = {
      "anti-E": {
        "cell-1": "homozygous",
        "cell-3": "heterozygous",
      },
    };

    expect(countRuleOutDifferences(userMarks, answerMarks)).toBe(3);
  });

  it("counts proof differences across proof-marked cells", () => {
    const userProofMarks: Record<string, ProofMark> = {
      "cell-1": "positive",
      "cell-2": "negative",
    };
    const answerProofMarks: Record<string, ProofMark> = {
      "cell-1": "positive",
      "cell-3": "negative",
    };

    expect(countProofDifferences(userProofMarks, answerProofMarks)).toBe(2);
  });
});
