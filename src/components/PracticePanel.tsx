"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { antibodies, antibodyById, antigenGroups, antigens } from "@/lib/antibodyPolicy";
import { practiceCases } from "@/lib/practiceCases";
import {
  canMarkRuleOut,
  createAnswerKeyMarks,
  createProofAnswerMarks,
  cycleRuleOutMark,
  cycleProofMark,
  evaluatePanel,
  isReactive,
} from "@/lib/ruleOutEngine";
import {
  countProofDifferences,
  countRuleOutDifferences,
  countStatusDifferences,
  cycleManualStatus,
  manualStatusFromEvaluation,
  manualStatusLabels,
  summarizeManualStatuses,
} from "@/lib/panelComparison";
import type { Antibody, DonorCell, ManualStatus, ProofMark, RuleOutMark, UserMarks } from "@/lib/types";

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

const getComparisonClass = (currentValue: string, expectedValue: string, compare: boolean) => {
  if (!compare) {
    return "";
  }

  if (currentValue === expectedValue && currentValue !== "none") {
    return "comparison-match";
  }

  if (currentValue === "none" && expectedValue === "none") {
    return "";
  }

  return "comparison-mismatch";
};

const getStatusComparisonClass = (currentValue: string, expectedValue: string, compare: boolean) => {
  if (!compare) {
    return "";
  }

  if (currentValue === "none") {
    return "";
  }

  return currentValue === expectedValue ? "comparison-match" : "comparison-mismatch";
};

const getFinalAnswerComparisonClass = (currentValue: string, expectedValue: string, compare: boolean) => {
  if (!compare) {
    return "";
  }

  return currentValue === expectedValue ? "comparison-match" : "comparison-mismatch";
};

const toStatusMap = (evaluations: ReturnType<typeof evaluatePanel>) =>
  evaluations.reduce<Record<string, ManualStatus>>((statuses, evaluation) => {
    statuses[evaluation.antibodyId] = manualStatusFromEvaluation(evaluation.status);
    return statuses;
  }, {});

export function PracticePanel() {
  const [caseId, setCaseId] = useState(practiceCases[0].id);
  const [ruleOutMarks, setRuleOutMarks] = useState<UserMarks>({});
  const [proofMarksByCase, setProofMarksByCase] = useState<Record<string, Record<string, ProofMark>>>({});
  const [manualStatuses, setManualStatuses] = useState<Record<string, ManualStatus>>({});
  const [selectedAnswerId, setSelectedAnswerId] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const caseData = practiceCases.find((item) => item.id === caseId) ?? practiceCases[0];
  const selectedAnswer = selectedAnswerId ? antibodyById.get(selectedAnswerId) : undefined;
  const targetAntibody = antibodyById.get(caseData.targetAntibodyId);

  const answerRuleOutMarks = createAnswerKeyMarks(caseData);
  const answerEvaluations = evaluatePanel(caseData, answerRuleOutMarks);
  const answerStatusMarks = toStatusMap(answerEvaluations);
  const answerProofMarks = targetAntibody ? createProofAnswerMarks(caseData, targetAntibody) : {};

  const userProofMarks = proofMarksByCase[caseId] ?? {};
  const userStatusSummary = summarizeManualStatuses(manualStatuses);
  const statusDifferenceCount = countStatusDifferences(manualStatuses, answerStatusMarks);
  const ruleOutDifferenceCount = countRuleOutDifferences(ruleOutMarks, answerRuleOutMarks);
  const proofDifferenceCount = countProofDifferences(userProofMarks, answerProofMarks);

  const panelTableStyle: PanelTableStyle = {
    "--antibody-count": antibodies.length,
    "--status-col-width": "100px",
    minWidth: `${70 + 70 + antibodies.length * 38}px`,
  };

  const resetAttempt = () => {
    setRuleOutMarks({});
    setProofMarksByCase({});
    setManualStatuses({});
    setSelectedAnswerId("");
    setShowAnswer(false);
  };

  const changeCase = (nextCaseId: string) => {
    setCaseId(nextCaseId);
    resetAttempt();
  };

  const toggleRuleOutMark = (antibody: Antibody, cell: DonorCell) => {
    if (!showAnswer) {
      setRuleOutMarks((currentMarks) => {
        const caseMarks = currentMarks[antibody.id] ?? {};
        const current = getMark(currentMarks, antibody.id, cell.id);
        const next = cycleRuleOutMark(current);
        const antibodyMarks = { ...caseMarks };

        if (next === "none") {
          delete antibodyMarks[cell.id];
        } else {
          antibodyMarks[cell.id] = next;
        }

        return {
          ...currentMarks,
          [antibody.id]: antibodyMarks,
        };
      });
    }
  };

  const toggleProofMark = (cell: DonorCell) => {
    if (showAnswer || cell.isAutoControl) {
      return;
    }

    setProofMarksByCase((currentMarks) => {
      const caseMarks = { ...(currentMarks[caseId] ?? {}) };
      const current = getProofMark(currentMarks, caseId, cell.id);
      const nextProof = cycleProofMark(current);

      if (nextProof === "none") {
        delete caseMarks[cell.id];
      } else {
        caseMarks[cell.id] = nextProof;
      }

      return {
        ...currentMarks,
        [caseId]: caseMarks,
      };
    });
  };

  const toggleStatus = (antibody: Antibody) => {
    if (showAnswer) {
      return;
    }

    setManualStatuses((currentStatuses) => {
      const current = currentStatuses[antibody.id] ?? "none";
      const next = cycleManualStatus(current);
      const nextStatuses = { ...currentStatuses };

      if (next === "none") {
        delete nextStatuses[antibody.id];
      } else {
        nextStatuses[antibody.id] = next;
      }

      return nextStatuses;
    });
  };

  const revealAnswer = () => {
    setShowAnswer(true);
  };

  const renderTable = (mode: "user" | "answer") => {
    const isAnswerMode = mode === "answer";
    const interactive = !showAnswer && !isAnswerMode;
    const displayRuleOutMarks = isAnswerMode ? answerRuleOutMarks : ruleOutMarks;
    const compareRuleOutMarks = isAnswerMode ? ruleOutMarks : answerRuleOutMarks;
    const displayProofMarks = isAnswerMode ? answerProofMarks : userProofMarks;
    const compareProofMarks = isAnswerMode ? userProofMarks : answerProofMarks;
    const displayStatusMarks = isAnswerMode ? answerStatusMarks : manualStatuses;
    const compareStatusMarks = isAnswerMode ? manualStatuses : answerStatusMarks;

    return (
      <article className="card compare-card" aria-label={isAnswerMode ? "Answer key" : "Your attempt"}>
        <div className="compare-header">
          <div>
            <h2>{isAnswerMode ? "Answer key" : "Your attempt"}</h2>
            <p className="compare-subtitle">
              {isAnswerMode
                ? `Correct answer: ${targetAntibody?.label ?? "Unknown"}`
                : selectedAnswer
                  ? `Selected answer: ${selectedAnswer.label}`
                  : ""}
            </p>
          </div>
          <p className="compare-note">
            {isAnswerMode
              ? "Your attempt is highlighted. The answer panel stays plain."
              : showAnswer
                ? "Your attempt is frozen. Use Restart to try again."
                : "Work the panel, then reveal the answer when you are ready."}
          </p>
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
                const proofMark = displayProofMarks[cell.id] ?? "none";
                const compareProofMark = compareProofMarks[cell.id] ?? "none";
                const proofComparisonClass = showAnswer && !isAnswerMode ? getComparisonClass(proofMark, compareProofMark, true) : "";

                return (
                  <tr key={cell.id}>
                    <td className={["sticky-col", proofComparisonClass].join(" ")}>
                      <button
                        aria-label={
                          cell.isAutoControl
                            ? `${cell.label} control`
                            : `${cell.label} proof mark ${proofLabels[proofMark] || "blank"}`
                        }
                        className={["proof-cell", proofMark !== "none" ? `proof-cell-${proofMark}` : ""].join(" ")}
                        disabled={cell.isAutoControl || !interactive}
                        title={
                          cell.isAutoControl
                            ? "Autocontrol is not used for proof marking."
                            : !interactive
                              ? "Attempt is frozen."
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
                      const displayMark = getMark(displayRuleOutMarks, antibody.id, cell.id);
                      const compareMark = getMark(compareRuleOutMarks, antibody.id, cell.id);
                      const comparisonClass = showAnswer && !isAnswerMode ? getComparisonClass(displayMark, compareMark, true) : "";
                      const disabled = !interactive || !canMarkRuleOut(cell, antibody);

                      return (
                        <td
                          className={[isFamilyDivider(antibody.antigenId) ? "group-divider" : "", comparisonClass].join(" ")}
                          key={`${cell.id}-${antibody.id}`}
                        >
                          <button
                            aria-label={`${cell.label} ${antibody.label} ${antigenDisplay(cell, antibody)}`}
                            className="antigen-cell"
                            disabled={disabled}
                            title={
                              !interactive
                                ? "Attempt is frozen."
                                : !canMarkRuleOut(cell, antibody)
                                  ? "This cell is not eligible for rule-out marking."
                                  : "Click to cycle rule-out mark."
                            }
                            type="button"
                            onClick={() => toggleRuleOutMark(antibody, cell)}
                          >
                            <span>{antigenDisplay(cell, antibody)}</span>
                            <span className={`mark mark-${displayMark}`}>{markLabels[displayMark]}</span>
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
                {antibodies.map((antibody) => {
                  const displayStatus = displayStatusMarks[antibody.id] ?? "none";
                  const compareStatus = compareStatusMarks[antibody.id] ?? "none";
                  const statusComparisonClass = showAnswer && !isAnswerMode ? getStatusComparisonClass(displayStatus, compareStatus, true) : "";

                  return (
                    <th
                      className={[
                        "status-col",
                        statusComparisonClass,
                        familyDividerAntigenIds.has(antibody.antigenId) ? "group-divider" : "",
                      ].join(" ")}
                      key={antibody.id}
                      title={showAnswer ? "Frozen comparison view." : "Click to cycle status."}
                      >
                        <button
                          aria-label={`${antibody.label} status ${manualStatusLabels[displayStatus] || "blank"}`}
                          className={["status-cell-button", displayStatus !== "none" ? `status-${displayStatus}` : ""].join(" ")}
                          disabled={!interactive}
                          type="button"
                          onClick={() => toggleStatus(antibody)}
                        >
                        {manualStatusLabels[displayStatus]}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>

        {isAnswerMode && showAnswer ? (
          <div className="comparison-summary">
            <span className="pill">
              Status diffs: <strong>{statusDifferenceCount}</strong>
            </span>
            <span className="pill">
              Rule-out diffs: <strong>{ruleOutDifferenceCount}</strong>
            </span>
            <span className="pill">
              Proof diffs: <strong>{proofDifferenceCount}</strong>
            </span>
          </div>
        ) : null}
      </article>
    );
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
          <button className="button secondary" type="button" onClick={resetAttempt}>
            Restart
          </button>
          <button className="button" type="button" onClick={revealAnswer}>
            Reveal answer
          </button>
        </div>
      </div>

      <p className="lede">
        Practice the panel, mark your proof cells, and cycle the footer status yourself.
        Reveal the answer when you are ready to compare your attempt against the target.
      </p>

      <div className="status-row" aria-label="Current manual status summary and final answer">
        <div className="field status-field">
          <label htmlFor={`final-answer-${caseId}`}>Final answer</label>
          <select
            id={`final-answer-${caseId}`}
            value={selectedAnswerId}
            disabled={showAnswer}
            className={["final-answer-select", showAnswer ? getFinalAnswerComparisonClass(selectedAnswerId, caseData.targetAntibodyId, true) : ""].join(" ")}
            onChange={(event) => setSelectedAnswerId(event.target.value)}
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
          Suspect: <strong>{userStatusSummary.suspect}</strong>
        </span>
        <span className="pill">
          Partial: <strong>{userStatusSummary.partial}</strong>
        </span>
        <span className="pill">
          Out: <strong>{userStatusSummary.ruledOut}</strong>
        </span>
      </div>

      {showAnswer ? (
        <div className="compare-layout">
          {renderTable("user")}
          {renderTable("answer")}
        </div>
      ) : (
        renderTable("user")
      )}

      <section className="feedback" aria-label="Practice feedback">
        <article className="card">
          <h2>How To Use The Panel</h2>
          <p>
            Click antigen-positive cells to cycle blank, heterozygous, and homozygous
            marks. Click the cell number to cycle proof marks. Click the footer status
            cells to cycle blank, partial, out, and suspect. Reveal freezes your attempt
            and shows the answer beside it.
          </p>
        </article>
        <article className="card">
          <h2>Answer Check</h2>
          {showAnswer ? (
            <>
              <p className="answer-summary">{caseData.summary}</p>
              <p>
                Your selected answer: <strong>{selectedAnswer?.label ?? "None"}</strong>
              </p>
              <p>
                Correct answer: <strong>{targetAntibody?.label ?? "Unknown"}</strong>
              </p>
              <p>
                Differences are highlighted in red or green on your attempt. The answer panel stays plain.
              </p>
            </>
          ) : (
            <p>
              Choose a final answer, work the panel, and click Reveal answer when you are
              ready to compare your attempt with the key.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}
