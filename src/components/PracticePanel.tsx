"use client";

import { useMemo, useState } from "react";
import { antibodies, antigens } from "@/lib/antibodyPolicy";
import { practiceCases } from "@/lib/practiceCases";
import {
  createAnswerKeyMarks,
  evaluatePanel,
  getSuggestedMark,
  isReactive,
  summarizeEvaluation,
} from "@/lib/ruleOutEngine";
import type { Antibody, DonorCell, RuleOutMark, UserMarks } from "@/lib/types";

const markLabels: Record<RuleOutMark, string> = {
  none: "",
  heterozygous: "Het",
  homozygous: "Hom",
};

const cycleMark = (current: RuleOutMark, suggested: RuleOutMark): RuleOutMark => {
  if (current === "none") {
    return suggested === "none" ? "heterozygous" : suggested;
  }

  if (current === "heterozygous") {
    return "homozygous";
  }

  return "none";
};

const getMark = (marks: UserMarks, antibodyId: string, cellId: string): RuleOutMark =>
  marks[antibodyId]?.[cellId] ?? "none";

const antigenDisplay = (cell: DonorCell, antibody: Antibody) => {
  const antigen = cell.antigens[antibody.antigenId];
  if (antigen === "unknown") {
    return "?";
  }
  return antigen === "positive" ? "+" : "0";
};

export function PracticePanel() {
  const [caseId, setCaseId] = useState(practiceCases[0].id);
  const [marks, setMarks] = useState<UserMarks>({});
  const [showAnswer, setShowAnswer] = useState(false);

  const caseData = practiceCases.find((item) => item.id === caseId) ?? practiceCases[0];
  const evaluations = useMemo(() => evaluatePanel(caseData, marks), [caseData, marks]);
  const summary = useMemo(() => summarizeEvaluation(caseData, marks), [caseData, marks]);
  const answerMarks = useMemo(() => createAnswerKeyMarks(caseData), [caseData]);
  const answerSummary = useMemo(() => summarizeEvaluation(caseData, answerMarks), [caseData, answerMarks]);

  const changeCase = (nextCaseId: string) => {
    setCaseId(nextCaseId);
    setMarks({});
    setShowAnswer(false);
  };

  const toggleMark = (antibody: Antibody, cell: DonorCell) => {
    const suggested = getSuggestedMark(cell, caseData, antibody);
    const reaction = caseData.reactions[cell.id];

    if (cell.isAutoControl || isReactive(reaction) || cell.antigens[antibody.antigenId] !== "positive") {
      return;
    }

    setMarks((currentMarks) => {
      const current = getMark(currentMarks, antibody.id, cell.id);
      const next = cycleMark(current, suggested);
      const antibodyMarks = { ...(currentMarks[antibody.id] ?? {}) };

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
  };

  const markAnswerKey = () => {
    setMarks(answerMarks);
    setShowAnswer(true);
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
          <button className="button secondary" type="button" onClick={() => setMarks({})}>
            Clear marks
          </button>
          <button className="button" type="button" onClick={markAnswerKey}>
            Reveal answer
          </button>
        </div>
      </div>

      <p className="lede">{caseData.summary}</p>

      <div className="status-row" aria-label="Current rule-out summary">
        <span className="pill">
          Ruled out: <strong>{summary.ruledOut}</strong>
        </span>
        <span className="pill">
          Partial: <strong>{summary.partial}</strong>
        </span>
        <span className="pill">
          Still possible: <strong>{summary.possible.length}</strong>
        </span>
      </div>

      <div className="table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th className="sticky-col">Cell</th>
              <th>Reaction</th>
              {antigens.map((antigen) => (
                <th key={antigen.id}>{antigen.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {caseData.cells.map((cell) => {
              const reaction = caseData.reactions[cell.id];
              return (
                <tr key={cell.id}>
                  <td className="sticky-col">{cell.label}</td>
                  <td className={isReactive(reaction) ? "reaction-positive" : "reaction-negative"}>
                    {reaction}
                  </td>
                  {antibodies.map((antibody) => {
                    const mark = getMark(marks, antibody.id, cell.id);
                    const suggested = getSuggestedMark(cell, caseData, antibody);
                    const disabled =
                      cell.isAutoControl ||
                      isReactive(reaction) ||
                      cell.antigens[antibody.antigenId] !== "positive";
                    return (
                      <td key={`${cell.id}-${antibody.id}`}>
                        <button
                          aria-label={`${cell.label} ${antibody.label} ${antigenDisplay(cell, antibody)}`}
                          className="antigen-cell"
                          disabled={disabled}
                          title={
                            disabled
                              ? "Rule-outs use nonreactive antigen-positive donor cells"
                              : `Click to mark ${suggested === "homozygous" ? "homozygous" : "heterozygous"} rule-out`
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
              <th />
              {evaluations.map((evaluation) => (
                <th
                  className={evaluation.status === "ruled-out" ? "antibody-ruled-out" : undefined}
                  key={evaluation.antibodyId}
                  title={evaluation.explanation}
                >
                  {evaluation.status === "ruled-out"
                    ? "Out"
                    : evaluation.status === "partial"
                      ? "Partial"
                      : evaluation.status === "possible"
                        ? "Possible"
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
            Click nonreactive antigen-positive cells to mark rule-outs. Dosage-sensitive
            antibodies need homozygous evidence for a complete rule-out in this training
            policy. Heterozygous evidence remains visible as partial.
          </p>
        </article>
        <article className="card">
          <h2>Answer Check</h2>
          {showAnswer ? (
            <p>
              Expected remaining antibody: <strong>{answerSummary.possible.join(", ")}</strong>.
              Your current marks now show the full answer key for this synthetic case.
            </p>
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
