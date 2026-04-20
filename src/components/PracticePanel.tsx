"use client";

import { useMemo, useState } from "react";
import { antibodies, antigenGroups, antigens } from "@/lib/antibodyPolicy";
import { practiceCases } from "@/lib/practiceCases";
import {
  canMarkRuleOut,
  createAnswerKeyMarks,
  cycleRuleOutMark,
  evaluatePanel,
  isReactive,
  summarizeEvaluation,
} from "@/lib/ruleOutEngine";
import type { Antibody, DonorCell, RuleOutMark, UserMarks } from "@/lib/types";
import type { CSSProperties } from "react";

const markLabels: Record<RuleOutMark, string> = {
  none: "",
  heterozygous: "Het",
  homozygous: "Hom",
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
  const [marks, setMarks] = useState<UserMarks>({});
  const [showAnswer, setShowAnswer] = useState(false);

  const caseData = practiceCases.find((item) => item.id === caseId) ?? practiceCases[0];
  const evaluations = useMemo(() => evaluatePanel(caseData, marks), [caseData, marks]);
  const summary = useMemo(() => summarizeEvaluation(caseData, marks), [caseData, marks]);
  const answerMarks = useMemo(() => createAnswerKeyMarks(caseData), [caseData]);
  const panelTableStyle: PanelTableStyle = {
    "--antibody-count": antibodies.length,
    "--status-col-width": "92px",
    minWidth: `${72 + 80 + antibodies.length * 38}px`,
  };

  const changeCase = (nextCaseId: string) => {
    setCaseId(nextCaseId);
    setMarks({});
    setShowAnswer(false);
  };

  const toggleMark = (antibody: Antibody, cell: DonorCell) => {
    if (!canMarkRuleOut(cell, caseData, antibody)) {
      return;
    }

    setMarks((currentMarks) => {
      const current = getMark(currentMarks, antibody.id, cell.id);
      const next = cycleRuleOutMark(current);
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

      <p className="lede">
        Practice the panel, make your own rule-out calls, and use the reveal button when
        you are ready to check the answer.
      </p>

      <div className="status-row" aria-label="Current rule-out summary">
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
              return (
                <tr key={cell.id}>
                  <td className="sticky-col">{cell.label}</td>
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
                    const mark = getMark(marks, antibody.id, cell.id);
                    const disabled = !canMarkRuleOut(cell, caseData, antibody);
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
                            !canMarkRuleOut(cell, caseData, antibody)
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
            marks. Reactive cells stay clickable in practice mode so you can test your
            own judgment. Dosage-sensitive antibodies need homozygous evidence for a
            complete rule-out in this training policy.
          </p>
        </article>
        <article className="card">
          <h2>Answer Check</h2>
          {showAnswer ? (
            <>
              <p className="answer-summary">{caseData.summary}</p>
              <p>
                Your current marks now show the full answer key for this synthetic case.
              </p>
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
