import type { Antibody, Antigen } from "./types";

export const antigens: Antigen[] = [
  { id: "D", label: "D", system: "Rh" },
  { id: "C", label: "C", system: "Rh" },
  { id: "c", label: "c", system: "Rh" },
  { id: "E", label: "E", system: "Rh" },
  { id: "e", label: "e", system: "Rh" },
  { id: "Cw", label: "Cw", system: "Rh" },
  { id: "V", label: "V", system: "Rh" },
  { id: "K", label: "K", system: "Kell" },
  { id: "k", label: "k", system: "Kell" },
  { id: "Kpa", label: "Kpa", system: "Kell" },
  { id: "Kpb", label: "Kpb", system: "Kell" },
  { id: "Jsa", label: "Jsa", system: "Kell" },
  { id: "Jsb", label: "Jsb", system: "Kell" },
  { id: "Fya", label: "Fya", system: "Duffy" },
  { id: "Fyb", label: "Fyb", system: "Duffy" },
  { id: "Jka", label: "Jka", system: "Kidd" },
  { id: "Jkb", label: "Jkb", system: "Kidd" },
  { id: "Lea", label: "Lea", system: "Lewis" },
  { id: "Leb", label: "Leb", system: "Lewis" },
  { id: "P1", label: "P1", system: "P1PK" },
  { id: "M", label: "M", system: "MNS" },
  { id: "N", label: "N", system: "MNS" },
  { id: "S", label: "S", system: "MNS" },
  { id: "s", label: "s", system: "MNS" },
  { id: "Lua", label: "Lua", system: "Lutheran" },
  { id: "Lub", label: "Lub", system: "Lutheran" },
];

export const dosageSensitiveAntigenIds = new Set([
  "C",
  "c",
  "E",
  "e",
  "Fya",
  "Fyb",
  "Jka",
  "Jkb",
  "M",
  "N",
  "S",
  "s",
]);

export const antibodies: Antibody[] = antigens.map((antigen) => ({
  id: `anti-${antigen.id}`,
  label: `Anti-${antigen.label}`,
  antigenId: antigen.id,
  dosageSensitive: dosageSensitiveAntigenIds.has(antigen.id),
}));

export const antibodyById = new Map(antibodies.map((antibody) => [antibody.id, antibody]));

export const antigenGroups = [
  { label: "Rh-Hr", antigenIds: ["D", "C", "E", "Cw", "c", "e", "V"] },
  { label: "Kell", antigenIds: ["K", "k", "Kpa", "Kpb", "Jsa", "Jsb"] },
  { label: "Duffy", antigenIds: ["Fya", "Fyb"] },
  { label: "Kidd", antigenIds: ["Jka", "Jkb"] },
  { label: "Lewis", antigenIds: ["Lea", "Leb"] },
  { label: "P", antigenIds: ["P1"] },
  { label: "MNS", antigenIds: ["M", "N", "S", "s"] },
  { label: "Lutheran", antigenIds: ["Lua", "Lub"] },
];
