export const quickFacts = [
  "Clinically significant antibodies usually react at 37 C and/or AHG.",
  "Nonreactive cells are used to rule out likely antibody specificities.",
  "Dosage means homozygous cells often react more strongly than heterozygous cells.",
  "Autocontrol and DAT help separate alloantibodies from autoantibodies or mixed pictures.",
];

export const phaseRows = [
  {
    phase: "Immediate spin",
    meaning: "Often points toward cold-reactive antibodies such as ABO-type or Lewis patterns.",
    take: "If reactivity is only here, think colder and usually less clinically significant.",
  },
  {
    phase: "37 C",
    meaning: "Suggests a warmer thermal range and raises concern for clinically significant IgG.",
    take: "This phase matters when you are deciding whether an antibody could cause harm.",
  },
  {
    phase: "AHG",
    meaning: "Detects IgG-sensitized red cells that do not visibly agglutinate on their own.",
    take: "Strong AHG reactivity is a major clue that the antibody is clinically important.",
  },
];

export const systems = [
  {
    name: "Rh",
    summary: "Common, warm-reactive, and often dosage-sensitive.",
    why: "Rh antibodies are a major cause of transfusion reactions and HDFN.",
  },
  {
    name: "Kell",
    summary: "Highly immunogenic and usually clinically important.",
    why: "Anti-K can cause transfusion reactions and HDFN even when the serology is not dramatic.",
  },
  {
    name: "Duffy",
    summary: "Dosage-sensitive and enzyme-sensitive.",
    why: "Anti-Fya and anti-Fyb are important because they can shorten red cell survival and matter in pregnancy.",
  },
  {
    name: "Kidd",
    summary: "Weak, variable, and often delayed or evanescent.",
    why: "Kidd antibodies are classic delayed transfusion reaction antibodies and are easy to miss.",
  },
  {
    name: "Lewis",
    summary: "Often cold-reactive and usually less significant.",
    why: "Lewis antibodies are commonly less concerning, but rare warm-reactive exceptions exist.",
  },
];

export const workflow = [
  "Check the phase and reaction strength.",
  "Review autocontrol and DAT.",
  "Look for a pattern that matches a known antibody system.",
  "Rule out antibodies using nonreactive cells.",
  "Pay attention to dosage and homozygous cells.",
  "Rule in the best-fit antibody with positive and negative cells.",
  "Confirm with phenotype, history, enzyme behavior, or additional studies.",
];

export const enzymeEffects = [
  {
    effect: "Often weakened or destroyed",
    examples: "Duffy, M, N",
    meaning: "Enzyme treatment can remove useful target antigens from reagent cells.",
  },
  {
    effect: "Often enhanced",
    examples: "Rh, Kidd, Lewis, P1, I",
    meaning: "Some antibodies become easier to see after ficin or papain treatment.",
  },
  {
    effect: "Variable",
    examples: "S and s",
    meaning: "These can be affected inconsistently, so enzyme results must be interpreted carefully.",
  },
  {
    effect: "Unaffected",
    examples: "Kell",
    meaning: "Kell antigens are classically not destroyed by ficin in this teaching model.",
  },
  {
    effect: "Why it matters",
    examples: "Pattern recognition",
    meaning:
      "Enzymes can sharpen a pattern, but they can also erase helpful antigens.",
  },
];

export const references = [
  {
    label: "Dean L. Blood Groups and Red Cell Antigens",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK2261/",
  },
  {
    label: "Theis SR, Hashmi MF. Coombs Test",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK547707/",
  },
  {
    label: "Rosenkrans D, Zubair M, Doyal A. Rh Blood Group System",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK594252/",
  },
  {
    label: "Maheshwari A, Zubair M, Maheshwari A. Kell Blood Group System",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK609095/",
  },
  {
    label: "Maheshwari A, Killeen RB. Duffy Blood Group System",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK580473/",
  },
  {
    label: "Maheshwari A, Zubair M, Maheshwari A. Kidd Blood Group System",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK613287/",
  },
  {
    label: "Manduzio P. Alloantibody Identification: The Importance of Temperature, Strength Reaction and Enzymes",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11675097/",
  },
  {
    label: "Makroo RN, Arora B, Bhatia A, et al. Clinical significance of antibody specificities to M, N and Lewis blood group system",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4140072/",
  },
  {
    label: "Lewis-A Antibody in Clinical Practice: A Case Report",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11319887/",
  },
];

export const glossary = [
  {
    term: "Alloantibody",
    meaning: "An antibody made against a foreign red cell antigen, often after transfusion or pregnancy.",
  },
  {
    term: "Autoantibody",
    meaning: "An antibody that reacts with the patient's own red cells.",
  },
  {
    term: "Autocontrol",
    meaning: "The patient's serum tested against the patient's own red cells.",
  },
  {
    term: "DAT",
    meaning: "The test that looks for antibody or complement already coating red cells in vivo.",
  },
  {
    term: "IAT",
    meaning: "The test that looks for free antibody in serum or plasma using reagent cells in vitro.",
  },
  {
    term: "Dosage",
    meaning: "A stronger reaction when antigen is expressed in double dose rather than single dose.",
  },
  {
    term: "Clinically significant antibody",
    meaning: "An antibody likely to cause transfusion reactions or hemolytic disease of the fetus and newborn.",
  },
];
