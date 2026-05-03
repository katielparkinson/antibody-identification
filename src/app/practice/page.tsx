import { PracticePanel } from "@/components/PracticePanel";

export default function PracticePage() {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Practice panel</p>
        <h1>Rule out antibodies from an 11-cell panel.</h1>
        <p className="lede">
          Reactivity is already provided. Focus on crossing out antibody
          specificities using nonreactive antigen-positive cells and separating
          heterozygous evidence from homozygous evidence.
        </p>
      </section>

      <section className="section">
        <div className="stacked-cards">
          <article className="card">
            <h2>Procedure</h2>
            <ol>
              <li>Start with the reaction pattern and the autocontrol.</li>
              <li>Use the reactive cells to make your first antibody guess.</li>
              <li>Rule out antibodies using antigen-positive cells that do not react.</li>
              <li>
                If the antibody is dosage-sensitive, use homozygous cells for
                stronger rule-out evidence than heterozygous cells.
              </li>
              <li>
                Mark rule-outs with <strong>Het</strong> for heterozygous cells
                and <strong>Hom</strong> for homozygous cells.
              </li>
              <li>
                Use proof marks on the cell number for the antibody you think
                fits best. <strong>+</strong> means the cell is antigen-positive
                and reactive for that antibody. <strong>-</strong> means the cell
                is antigen-negative and nonreactive.
              </li>
              <li>
                To rule in, look for 3 antigen-positive reactive cells and 3
                antigen-negative nonreactive cells that support the same antibody.
              </li>
              <li>
                Rule out means a nonreactive antigen-positive cell makes that
                antibody less likely. To rule out an antibody, you need either
                2 homozygous rule-outs or 2 heterozygous rule-outs plus 1
                homozygous rule-out.
              </li>
              <li>
                Use the footer status row as your running judgment:
                <strong>Partial</strong> = some evidence, <strong>Out</strong> = ruled out,
                <strong>Suspect</strong> = still possible.
              </li>
              <li>
                Choose your final answer when the pattern feels complete. Rule
                in means enough positive and negative cells support one antibody.
              </li>
              <li>Reveal the answer to freeze your attempt and compare your work.</li>
              <li>Restart the case to try again from a clean slate.</li>
            </ol>
          </article>
          <article className="card">
            <h2>What Each Mark Means</h2>
            <ul>
              <li>
                <strong>Het</strong> means one antigen copy on the cell.
              </li>
              <li>
                <strong>Hom</strong> means two antigen copies on the cell.
              </li>
              <li>
                Use Het and Hom only on antigen columns when you are ruling out a candidate.
              </li>
              <li>
                Use + and - only on the cell number when you are proving your best-fit antibody.
              </li>
              <li>
                The footer status is a progress check, not the final answer.
              </li>
            </ul>
          </article>
          <article className="card">
            <h2>How To Use The Panel</h2>
            <ul>
              <li>Click antigen cells to cycle Het, Hom, and clear.</li>
              <li>Click the cell number to cycle proof marks between +, -, and clear.</li>
              <li>Click the footer status cell to cycle Partial, Out, Suspect, and clear.</li>
              <li>Choose a final answer when you are ready.</li>
              <li>Reveal the answer to freeze your attempt and compare the result.</li>
            </ul>
          </article>
          <article className="card">
            <h2>Answer Check</h2>
            <ul>
              <li>The answer view stays plain.</li>
              <li>Your attempt stays visible above the answer key after reveal and is highlighted where it differs.</li>
              <li>Use Restart to clear the case and try again.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <PracticePanel />
      </section>
    </div>
  );
}
