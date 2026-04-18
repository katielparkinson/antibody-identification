import type { DonorCell, PracticeCase } from "./types";

const cell = (
  label: string,
  antigens: DonorCell["antigens"],
  zygosity: DonorCell["zygosity"],
): DonorCell => ({
  id: `cell-${label}`,
  label,
  antigens,
  zygosity,
});

const baseNegative = {
  D: "negative",
  C: "negative",
  E: "negative",
  c: "negative",
  e: "negative",
  M: "negative",
  N: "negative",
  S: "negative",
  s: "negative",
  P1: "negative",
  Lea: "negative",
  Leb: "negative",
  K: "negative",
  k: "positive",
  Fya: "negative",
  Fyb: "negative",
  Jka: "negative",
  Jkb: "negative",
} as const;

const z = {
  D: "not_applicable",
  C: "unknown",
  E: "unknown",
  c: "unknown",
  e: "unknown",
  M: "unknown",
  N: "unknown",
  S: "unknown",
  s: "unknown",
  P1: "not_applicable",
  Lea: "not_applicable",
  Leb: "not_applicable",
  K: "not_applicable",
  k: "not_applicable",
  Fya: "unknown",
  Fyb: "unknown",
  Jka: "unknown",
  Jkb: "unknown",
} as const;

const autoControl: DonorCell = {
  id: "auto",
  label: "Auto",
  isAutoControl: true,
  antigens: { ...baseNegative },
  zygosity: { ...z },
};

export const practiceCases: PracticeCase[] = [
  {
    id: "case-anti-e",
    title: "Case 1: Rh Pattern",
    summary: "Synthetic panel with IAT reactivity consistent with anti-E.",
    targetAntibodies: ["anti-E"],
    cells: [
      cell("1", { ...baseNegative, D: "positive", C: "positive", e: "positive", M: "positive", S: "positive", k: "positive", Fya: "positive", Jka: "positive" }, { ...z, C: "homozygous", e: "heterozygous", M: "heterozygous", S: "homozygous", Fya: "homozygous", Jka: "heterozygous" }),
      cell("2", { ...baseNegative, D: "positive", C: "positive", e: "positive", N: "positive", s: "positive", P1: "positive", k: "positive", Fyb: "positive", Jkb: "positive" }, { ...z, C: "heterozygous", e: "heterozygous", N: "homozygous", s: "homozygous", Fyb: "homozygous", Jkb: "homozygous" }),
      cell("3", { ...baseNegative, D: "positive", E: "positive", c: "positive", M: "positive", N: "positive", K: "positive", k: "positive", Jka: "positive" }, { ...z, E: "heterozygous", c: "heterozygous", M: "heterozygous", N: "heterozygous", Jka: "homozygous" }),
      cell("4", { ...baseNegative, E: "positive", c: "positive", e: "positive", S: "positive", s: "positive", Lea: "positive", k: "positive", Fya: "positive" }, { ...z, E: "heterozygous", c: "heterozygous", e: "heterozygous", S: "heterozygous", s: "heterozygous", Fya: "homozygous" }),
      cell("5", { ...baseNegative, c: "positive", e: "positive", M: "positive", P1: "positive", Leb: "positive", k: "positive", Fyb: "positive", Jkb: "positive" }, { ...z, c: "homozygous", e: "homozygous", M: "homozygous", Fyb: "heterozygous", Jkb: "heterozygous" }),
      cell("6", { ...baseNegative, E: "positive", c: "positive", e: "positive", N: "positive", S: "positive", k: "positive", Fya: "positive", Jka: "positive", Jkb: "positive" }, { ...z, E: "heterozygous", c: "heterozygous", e: "heterozygous", N: "heterozygous", S: "homozygous", Fya: "heterozygous", Jka: "heterozygous", Jkb: "heterozygous" }),
      cell("7", { ...baseNegative, c: "positive", e: "positive", M: "positive", s: "positive", Lea: "positive", k: "positive", Fya: "positive", Jka: "positive" }, { ...z, c: "homozygous", e: "homozygous", M: "heterozygous", s: "homozygous", Fya: "homozygous", Jka: "homozygous" }),
      cell("8", { ...baseNegative, c: "positive", e: "positive", N: "positive", S: "positive", P1: "positive", k: "positive", Fyb: "positive", Jkb: "positive" }, { ...z, c: "homozygous", e: "homozygous", N: "homozygous", S: "heterozygous", Fyb: "homozygous", Jkb: "homozygous" }),
      cell("9", { ...baseNegative, c: "positive", e: "positive", M: "positive", N: "positive", s: "positive", K: "positive", k: "positive", Fya: "positive", Fyb: "positive" }, { ...z, c: "homozygous", e: "homozygous", M: "heterozygous", N: "heterozygous", s: "heterozygous", Fya: "heterozygous", Fyb: "heterozygous" }),
      cell("10", { ...baseNegative, C: "positive", c: "positive", e: "positive", S: "positive", s: "positive", P1: "positive", Leb: "positive", k: "positive", Jka: "positive" }, { ...z, C: "heterozygous", c: "heterozygous", e: "homozygous", S: "heterozygous", s: "heterozygous", Jka: "homozygous" }),
      cell("11", { ...baseNegative, D: "positive", E: "positive", c: "positive", M: "positive", N: "positive", Lea: "positive", k: "positive", Fyb: "positive", Jkb: "positive" }, { ...z, E: "heterozygous", c: "heterozygous", M: "heterozygous", N: "heterozygous", Fyb: "homozygous", Jkb: "homozygous" }),
      autoControl,
    ],
    reactions: {
      "cell-1": "0",
      "cell-2": "0",
      "cell-3": "2+",
      "cell-4": "2+",
      "cell-5": "0",
      "cell-6": "2+",
      "cell-7": "0",
      "cell-8": "0",
      "cell-9": "0",
      "cell-10": "0",
      "cell-11": "2+",
      auto: "0",
    },
  },
];

export const getPracticeCase = (caseId: string) =>
  practiceCases.find((practiceCase) => practiceCase.id === caseId) ?? practiceCases[0];
