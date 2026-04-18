import type { Antibody, Antigen } from "./types";

export const antigens: Antigen[] = [
  { id: "D", label: "D", system: "Rh", displayOrder: 10 },
  { id: "C", label: "C", system: "Rh", displayOrder: 20 },
  { id: "E", label: "E", system: "Rh", displayOrder: 30 },
  { id: "c", label: "c", system: "Rh", displayOrder: 40 },
  { id: "e", label: "e", system: "Rh", displayOrder: 50 },
  { id: "M", label: "M", system: "MNS", displayOrder: 60 },
  { id: "N", label: "N", system: "MNS", displayOrder: 70 },
  { id: "S", label: "S", system: "MNS", displayOrder: 80 },
  { id: "s", label: "s", system: "MNS", displayOrder: 90 },
  { id: "P1", label: "P1", system: "P1PK", displayOrder: 100 },
  { id: "Lea", label: "Lea", system: "Lewis", displayOrder: 110 },
  { id: "Leb", label: "Leb", system: "Lewis", displayOrder: 120 },
  { id: "K", label: "K", system: "Kell", displayOrder: 130 },
  { id: "k", label: "k", system: "Kell", displayOrder: 140 },
  { id: "Fya", label: "Fya", system: "Duffy", displayOrder: 150 },
  { id: "Fyb", label: "Fyb", system: "Duffy", displayOrder: 160 },
  { id: "Jka", label: "Jka", system: "Kidd", displayOrder: 170 },
  { id: "Jkb", label: "Jkb", system: "Kidd", displayOrder: 180 },
];

const dosageSensitive = new Set(["C", "E", "c", "e", "M", "N", "S", "s", "Fya", "Fyb", "Jka", "Jkb"]);

export const antibodies: Antibody[] = antigens.map((antigen) => ({
  id: `anti-${antigen.id}`,
  label: `Anti-${antigen.label}`,
  antigenId: antigen.id,
  dosageSensitive: dosageSensitive.has(antigen.id),
  displayOrder: antigen.displayOrder,
}));

export const antibodyById = new Map(antibodies.map((antibody) => [antibody.id, antibody]));
