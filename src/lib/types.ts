export type AntigenValue = "positive" | "negative" | "unknown";

export type Zygosity = "homozygous" | "heterozygous" | "not_applicable" | "unknown";

export type ReactionValue = "0" | "w+" | "1+" | "2+" | "3+" | "4+" | "mf";

export type RuleOutMark = "none" | "heterozygous" | "homozygous";

export type AntibodyStatus = "unmarked" | "partial" | "ruled-out" | "possible";

export type Antigen = {
  id: string;
  label: string;
  system: string;
  displayOrder: number;
};

export type Antibody = {
  id: string;
  label: string;
  antigenId: string;
  dosageSensitive: boolean;
  displayOrder: number;
};

export type DonorCell = {
  id: string;
  label: string;
  isAutoControl?: boolean;
  antigens: Record<string, AntigenValue>;
  zygosity: Record<string, Zygosity>;
};

export type PracticeCase = {
  id: string;
  title: string;
  summary: string;
  targetAntibodies: string[];
  cells: DonorCell[];
  reactions: Record<string, ReactionValue>;
};

export type UserMarks = Record<string, Record<string, RuleOutMark>>;

export type AntibodyEvaluation = {
  antibodyId: string;
  status: AntibodyStatus;
  heterozygousRuleOuts: string[];
  homozygousRuleOuts: string[];
  explanation: string;
};
