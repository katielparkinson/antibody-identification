import { antigens } from "./antibodyPolicy";
import type { AntigenValue, Zygosity } from "./types";

const dosagePairs: Array<[string, string]> = [
  ["C", "c"],
  ["E", "e"],
  ["M", "N"],
  ["S", "s"],
  ["Jka", "Jkb"],
  ["Fya", "Fyb"],
];

const dosagePairMap = new Map<string, string>(
  dosagePairs.flatMap(([left, right]) => [
    [left, right],
    [right, left],
  ]),
);

const inferPairZygosity = (
  antigenId: string,
  value: AntigenValue,
  antigensById: Record<string, AntigenValue>,
): Zygosity => {
  const partnerId = dosagePairMap.get(antigenId);
  if (!partnerId) {
    return value === "positive" ? "homozygous" : "not_applicable";
  }

  const partnerValue = antigensById[partnerId];

  if (value !== "positive") {
    return "not_applicable";
  }

  if (partnerValue === "positive") {
    return "heterozygous";
  }

  return "homozygous";
};

export const inferCellZygosity = (cellAntigens: Record<string, AntigenValue>): Record<string, Zygosity> => {
  return Object.fromEntries(
    antigens.map((antigen) => [
      antigen.id,
      inferPairZygosity(antigen.id, cellAntigens[antigen.id] ?? "negative", cellAntigens),
    ]),
  ) as Record<string, Zygosity>;
};
