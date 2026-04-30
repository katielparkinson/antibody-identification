CREATE TABLE antigens (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  blood_group_system TEXT NOT NULL
);

CREATE TABLE antibodies (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  antigen_id TEXT NOT NULL REFERENCES antigens(id),
  dosage_sensitive INTEGER NOT NULL
);

CREATE TABLE practice_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  target_antibody_id TEXT NOT NULL REFERENCES antibodies(id)
);

CREATE TABLE donor_cells (
  id TEXT PRIMARY KEY,
  practice_case_id TEXT NOT NULL REFERENCES practice_cases(id),
  label TEXT NOT NULL,
  is_auto_control INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE donor_cell_antigens (
  donor_cell_id TEXT NOT NULL REFERENCES donor_cells(id),
  antigen_id TEXT NOT NULL REFERENCES antigens(id),
  antigen_value TEXT NOT NULL CHECK (antigen_value IN ('positive', 'negative', 'unknown')),
  zygosity TEXT NOT NULL CHECK (zygosity IN ('homozygous', 'heterozygous', 'not_applicable', 'unknown')),
  PRIMARY KEY (donor_cell_id, antigen_id)
);

CREATE TABLE case_reactions (
  practice_case_id TEXT NOT NULL REFERENCES practice_cases(id),
  donor_cell_id TEXT NOT NULL REFERENCES donor_cells(id),
  reaction_value TEXT NOT NULL CHECK (reaction_value IN ('0', 'w+', '1+', '2+', '3+', '4+', 'mf')),
  PRIMARY KEY (practice_case_id, donor_cell_id)
);
