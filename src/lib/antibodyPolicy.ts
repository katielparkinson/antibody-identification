import type { Antibody, Antigen } from "./types";

export const antigens: Antigen[] = [
  { id: "D", label: "D", system: "Rh", displayOrder: 10 },
  { id: "C", label: "C", system: "Rh", displayOrder: 20 },
  { id: "c", label: "c", system: "Rh", displayOrder: 40 },
  { id: "E", label: "E", system: "Rh", displayOrder: 30 },
  { id: "e", label: "e", system: "Rh", displayOrder: 50 },
  { id: "Cw", label: "Cw", system: "Rh", displayOrder: 35 },
  { id: "V", label: "V", system: "Rh", displayOrder: 55 },
  { id: "K", label: "K", system: "Kell", displayOrder: 130 },
  { id: "k", label: "k", system: "Kell", displayOrder: 140 },
  { id: "Kpa", label: "Kpa", system: "Kell", displayOrder: 145 },
  { id: "Kpb", label: "Kpb", system: "Kell", displayOrder: 146 },
  { id: "Jsa", label: "Jsa", system: "Kell", displayOrder: 147 },
  { id: "Jsb", label: "Jsb", system: "Kell", displayOrder: 148 },
  { id: "Fya", label: "Fya", system: "Duffy", displayOrder: 150 },
  { id: "Fyb", label: "Fyb", system: "Duffy", displayOrder: 160 },
  { id: "Jka", label: "Jka", system: "Kidd", displayOrder: 170 },
  { id: "Jkb", label: "Jkb", system: "Kidd", displayOrder: 180 },
  { id: "Lea", label: "Lea", system: "Lewis", displayOrder: 190 },
  { id: "Leb", label: "Leb", system: "Lewis", displayOrder: 191 },
  { id: "P1", label: "P1", system: "P1PK", displayOrder: 200 },
  { id: "M", label: "M", system: "MNS", displayOrder: 210 },
  { id: "N", label: "N", system: "MNS", displayOrder: 220 },
  { id: "S", label: "S", system: "MNS", displayOrder: 230 },
  { id: "s", label: "s", system: "MNS", displayOrder: 240 },
  { id: "Lua", label: "Lua", system: "Lutheran", displayOrder: 250 },
  { id: "Lub", label: "Lub", system: "Lutheran", displayOrder: 260 },
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

export type AntigenGroup = {
  label: string;
  antigenIds: string[];
};

export const antigenGroups: AntigenGroup[] = [
  { label: "Rh-Hr", antigenIds: ["D", "C", "E", "Cw", "c", "e", "V"] },
  { label: "Kell", antigenIds: ["K", "k", "Kpa", "Kpb", "Jsa", "Jsb"] },
  { label: "Duffy", antigenIds: ["Fya", "Fyb"] },
  { label: "Kidd", antigenIds: ["Jka", "Jkb"] },
  { label: "Lewis", antigenIds: ["Lea", "Leb"] },
  { label: "P", antigenIds: ["P1"] },
  { label: "MNS", antigenIds: ["M", "N", "S", "s"] },
  { label: "Lutheran", antigenIds: ["Lua", "Lub"] },
];
