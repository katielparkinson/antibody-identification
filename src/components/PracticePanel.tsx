"use client";

import { useMemo, useState } from "react";
import { antibodies, antibodyById, antigenGroups, antigens } from "@/lib/antibodyPolicy";
import { practiceCases } from "@/lib/practiceCases";
import {
  canMarkRuleOut,
  createAnswerKeyMarks,
  createProofAnswerMarks,
  cycleRuleOutMark,
  cycleProofMark,
  evaluatePanel,
  evaluateProofSelection,
  isReactive,
  summarizeEvaluation,
} from "@/lib/ruleOutEngine";
import type { Antibody, DonorCell, ProofMark, RuleOutMark, UserMarks } from "@/lib/types";
import type { CSSProperties } from "react";

const markLabels: Record<RuleOutMark, string> = {
  none: "",
  heterozygous: "Het",
  homozygous: "Hom",
};

const proofLabels: Record<ProofMark, string> = {
  none: "",
  positive: "+",
  negative: "-",
};

const getMark = (marks: UserMarks, antibodyId: string, cellId: string): RuleOutMark =>
  marks[antibodyId]?.[cellId] ?? "none";

const getProofMark = (
  marks: Record<string, Record<string, ProofMark>>,
  antibodyId: string,
  cellId: string,
): ProofMark => marks[antibodyId]?.[cellId] ?? "none";

const antigenDisplay = (cell: DonorCell, antibody: Antibody) => {
  if (cell.isAutoControl) {
    return "";
  }

  const antigen = cell.antigens[antibody.antigenId];
  if (antigen === "unknown") {
    return "?";
  }
  return antigen === "positive" ? "+" : "0";
};

type PanelTableStyle = CSSProperties & {
  ["--antibody-count"]: number;
  ["--status-col-width"]: string;
};

const familyDividerAntigenIds = new Set(
  antigenGroups
    .map((group) => group.antigenIds[group.antigenIds.length - 1])
    .filter((antigenId): antigenId is string => Boolean(antigenId)),
);

const isFamilyDivider = (antigenId: string) => familyDividerAntigenIds.has(antigenId);

export function PracticePanel() {
  const [caseId, setCaseId] = useState(practiceCases[0].id);
  const [ruleOutMarksByCase, setRuleOutMarksByCase] = useState<Record<string, UserMarks>>({});
  const [proofMarksByCase, setProofMarksByCase] = useState<
    Record<string, Record<string, Record<string, ProofMark>>>
  >({});
  const [selectedAnswerByCase, setSelectedAnswerByCase] = useState<Record<string, string>>({});
  const [showAnswerByCase, setShowAnswerByCase] = useState<Record<string, boolean>>({});

  const caseData = practiceCases.find((item) => item.id === caseId) ?? practiceCases[0];
  const marks = useMemo(() => ruleOutMarksByCase[caseId] ?? {}, [ruleOutMarksByCase, caseId]);
  const selectedAnswerId = selectedAnswerByCase[caseId] ?? "";
  const selectedAnswer = selectedAnswerId ? antibodyById.get(selectedAnswerId) : undefined;
  const targetAntibody = antibodyById.get(caseData.targetAntibodyId);
  const caseProofMarks = useMemo(
    () => proofMarksByCase[caseId] ?? {},
    [proofMarksByCase, caseId],
  );
  const proofMarks = useMemo(
    () => (selectedAnswerId ? caseProofMarks[selectedAnswerId] ?? {} : {}),
    [caseProofMarks, selectedAnswerId],
  );
  const showAnswer = showAnswerByCase[caseId] ?? false;
  const answerMarks = createAnswerKeyMarks(caseData);
  const displayedRuleOutMarks = showAnswer ? answerMarks : marks;
  const displayedProofMarks =
    showAnswer && targetAntibody ? createProofAnswerMarks(caseData, targetAntibody) : proofMarks;
  const evaluations = useMemo(() => evaluatePanel(caseData, displayedRuleOutMarks), [caseData, displayedRuleOutMarks]);
  const summary = useMemo(() => summarizeEvaluation(caseData, displayedRuleOutMarks), [caseData, displayedRuleOutMarks]);
  const proofEvaluation = useMemo(() => {
    if (!selectedAnswer) {
      return undefined;
    }

    return evaluateProofSelection(caseData, selectedAnswer, proofMarks);
  }, [caseData, proofMarks, selectedAnswer]);
  const panelTableStyle: PanelTableStyle = {
    "--antibody-count": antibodies.length,
    "--status-col-width": "92px",
    minWidth: `${70 + 70 + antibodies.length * 38}px`,
  };

  const changeCase = (nextCaseId: string) => {
    setCaseId(nextCaseId);
  };

  const toggleMark = (antibody: Antibody, cell: DonorCell) => {
    if (!canMarkRuleOut(cell, antibody)) {
      return;
    }

    setRuleOutMarksByCase((currentMarks) => {
      const caseMarks = currentMarks[caseId] ?? {};
      const current = getMark(caseMarks, antibody.id, cell.id);
      const next = cycleRuleOutMark(current);
      const antibodyMarks = { ...(caseMarks[antibody.id] ?? {}) };

      if (next === "none") {
        delete antibodyMarks[cell.id];
      } else {
        antibodyMarks[cell.id] = next;
      }

      return {
        ...currentMarks,
        [caseId]: {
          ...caseMarks,
          [antibody.id]: antibodyMarks,
        },
      };
    });
  };

  const toggleProofMark = (cell: DonorCell) => {
    if (!selectedAnswer || cell.isAutoControl || showAnswer) {
      return;
    }

    setProofMarksByCase((currentMarks) => {
      const caseMarks = currentMarks[caseId] ?? {};
      const antibodyMarks = { ...(caseMarks[selectedAnswer.id] ?? {}) };
      const current = getProofMark(caseMarks, selectedAnswer.id, cell.id);
      const next = cycleProofMark(current);

      if (next === "none") {
        delete antibodyMarks[cell.id];
      } else {
        antibodyMarks[cell.id] = next;
      }

      return {
        ...currentMarks,
        [caseId]: {
          ...caseMarks,
          [selectedAnswer.id]: antibodyMarks,
        },
      };
    });
  };

  const clearCurrentCase = () => {
    setRuleOutMarksByCase((currentMarks) => {
      const nextMarks = { ...currentMarks };
      delete nextMarks[caseId];
      return nextMarks;
    });
    setProofMarksByCase((currentMarks) => {
      const nextMarks = { ...currentMarks };
      delete nextMarks[caseId];
      return nextMarks;
    });
    setSelectedAnswerByCase((currentAnswers) => {
      const nextAnswers = { ...currentAnswers };
      delete nextAnswers[caseId];
      return nextAnswers;
    });
    setShowAnswerByCase((currentState) => {
      const nextState = { ...currentState };
      delete nextState[caseId];
      return nextState;
    });
  };

  const revealAnswer = () => {
    setShowAnswerByCase((currentState) => ({
      ...currentState,
      [caseId]: true,
    }));
  };

  return (
    <div className="panel-shell">
      <div className="toolbar">
        <div className="field">
          <label htmlFor="case">Practice case</label>
          <select id="case" value={caseId} onChange={(event) => changeCase(event.target.value)}>
            {practiceCases.map((practiceCase) => (
              <option key={practiceCase.id} value={practiceCase.id}>
                {practiceCase.title}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <button className="button secondary" type="button" onClick={clearCurrentCase}>
            Clear marks
          </button>
          <button className="button" type="button" onClick={revealAnswer}>
            Reveal answer
          </button>
        </div>
      </div>

      <p className="lede">
        Practice the panel, make your own rule-out calls, and use the reveal button when
        you are ready to check the answer.
      </p>

      <div className="status-row" aria-label="Current rule-out summary and final answer">
        <div className="field status-field">
          <label htmlFor={`final-answer-${caseId}`}>Final answer</label>
          <select
            id={`final-answer-${caseId}`}
            value={selectedAnswerId}
            onChange={(event) =>
              setSelectedAnswerByCase((currentAnswers) => ({
                ...currentAnswers,
                [caseId]: event.target.value,
              }))
            }
          >
            <option value="">Choose antibody</option>
            {antibodies.map((antibody) => (
              <option key={antibody.id} value={antibody.id}>
                {antibody.label}
              </option>
            ))}
          </select>
        </div>
        <span className="pill">
          Ruled out: <strong>{summary.ruledOut}</strong>
        </span>
        <span className="pill">
          Partial: <strong>{summary.partial}</strong>
        </span>
      </div>

      <div className="table-wrap">
        <table className="panel-table" style={panelTableStyle}>
          <colgroup>
            <col className="panel-col-cell" />
            <col className="panel-col-reaction" />
            {antigens.map((antigen) => (
              <col key={antigen.id} className="panel-col-antibody" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky-col" rowSpan={2}>
                Cell
              </th>
              <th className="sticky-col reaction-col" rowSpan={2}>
                Reaction
              </th>
              {antigenGroups.map((group, index) => (
                <th
                  className={["group-header", index < antigenGroups.length - 1 ? "group-divider" : ""].join(" ")}
                  colSpan={group.antigenIds.length}
                  key={group.label}
                >
                  {group.label}
                </th>
              ))}
            </tr>
            <tr>
              {antigens.map((antigen) => (
                <th
                  className={isFamilyDivider(antigen.id) ? "group-divider" : undefined}
                  key={antigen.id}
                  title={antigen.system}
                >
                  {antigen.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {caseData.cells.map((cell) => {
              const reaction = caseData.reactions[cell.id];
              const proofMark = displayedProofMarks[cell.id] ?? "none";
              return (
                <tr key={cell.id}>
                  <td className="sticky-col">
                    <button
                      aria-label={
                        cell.isAutoControl
                          ? `${cell.label} control`
                          : selectedAnswer
                            ? `${cell.label} proof mark ${proofLabels[proofMark]} for ${selectedAnswer.label}`
                            : `${cell.label} proof mark`
                      }
                      className={["proof-cell", proofMark !== "none" ? `proof-cell-${proofMark}` : ""].join(" ")}
                      disabled={cell.isAutoControl || !selectedAnswer || showAnswer}
                      title={
                        cell.isAutoControl
                          ? "Autocontrol is not used for proof marking."
                          : !selectedAnswer
                            ? "Choose a final antibody answer first."
                            : showAnswer
                              ? "Answer is revealed."
                              : "Click to cycle proof mark."
                      }
                      type="button"
                      onClick={() => toggleProofMark(cell)}
                    >
                      <span className="proof-cell-number">{cell.label}</span>
                      <span className={`proof-cell-mark proof-cell-mark-${proofMark}`}>
                        {proofLabels[proofMark]}
                      </span>
                    </button>
                  </td>
                  <td
                    className={[
                      "sticky-col",
                      "reaction-col",
                      isReactive(reaction) ? "reaction-positive" : "reaction-negative",
                    ].join(" ")}
                  >
                    {reaction}
                  </td>
                  {antibodies.map((antibody) => {
                    const mark = getMark(displayedRuleOutMarks, antibody.id, cell.id);
                    const disabled = !canMarkRuleOut(cell, antibody);
                    return (
                      <td
                        className={isFamilyDivider(antibody.antigenId) ? "group-divider" : undefined}
                        key={`${cell.id}-${antibody.id}`}
                      >
                        <button
                          aria-label={`${cell.label} ${antibody.label} ${antigenDisplay(cell, antibody)}`}
                          className="antigen-cell"
                          disabled={disabled}
                          title={
                            !canMarkRuleOut(cell, antibody)
                              ? "This cell is not eligible for rule-out marking."
                              : "Click to cycle rule-out mark."
                          }
                          type="button"
                          onClick={() => toggleMark(antibody, cell)}
                        >
                          <span>{antigenDisplay(cell, antibody)}</span>
                          <span className={`mark mark-${mark}`}>{markLabels[mark]}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th className="sticky-col">Status</th>
              <th className="sticky-col reaction-col status-col" />
              {evaluations.map((evaluation, index) => (
                <th
                  className={[
                    "status-col",
                    evaluation.status === "ruled-out" ? "antibody-ruled-out" : "",
                    familyDividerAntigenIds.has(antibodies[index]?.antigenId) ? "group-divider" : "",
                  ].join(" ")}
                  key={evaluation.antibodyId}
                  title={evaluation.explanation}
                >
                  {evaluation.status === "ruled-out"
                    ? "Out"
                    : evaluation.status === "partial"
                      ? "Partial"
                      : ""}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <section className="feedback" aria-label="Practice feedback">
        <article className="card">
          <h2>How To Use The Panel</h2>
          <p>
            Click antigen-positive cells to cycle blank, heterozygous, and homozygous
            marks. Click the cell number to cycle proof marks while a final antibody is
            selected. Reactive cells stay clickable in practice mode so you can test your
            own judgment. Dosage-sensitive antibodies need homozygous evidence for a
            complete rule-out in this training policy.
          </p>
        </article>
        <article className="card">
          <h2>Answer Check</h2>
          {showAnswer ? (
            <>
              <p className="answer-summary">{caseData.summary}</p>
              {selectedAnswer ? (
                <>
                  <p>
                    Selected answer: <strong>{selectedAnswer.label}</strong>
                  </p>
                  <p>
                    {selectedAnswer.id === caseData.targetAntibodyId
                      ? "Your selected answer matches the target antibody."
                      : `The target antibody is ${targetAntibody?.label ?? "unknown"}.`}
                  </p>
                  <p>
                    Proof status:{" "}
                    <strong>{proofEvaluation?.status === "proven" ? "Proven" : "Unproven"}</strong>
                  </p>
                </>
              ) : (
                <p>Select a final answer to check your proof marks against the case.</p>
              )}
              <p>The proof markers now show the correct support pattern for the case.</p>
            </>
          ) : (
            <p>
              Try to rule out every antibody except the one that fits the reaction pattern,
              then reveal the answer when you are ready.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}
