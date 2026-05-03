import type { Metadata } from "next";
import Link from "next/link";
import {
  enzymeEffects,
  glossary,
  phaseRows,
  quickFacts,
  references,
  systems,
  workflow,
} from "@/lib/learningContent";

export const metadata: Metadata = {
  title: "Antibody Identification | Full Guide",
  description: "A full transfusion-medicine study guide for antibody identification.",
};

const additionalTopics = [
  {
    title: "Red cell antigens and antibodies",
    body: "A panel works by matching patient serum or plasma against reagent red cells with known antigen profiles. The question is which antibody explains the reaction pattern.",
  },
  {
    title: "IAT vs DAT",
    body: "The indirect antiglobulin test detects free antibody in serum or plasma. The direct antiglobulin test detects IgG or complement already coating red cells in vivo.",
  },
  {
    title: "Alloantibody vs autoantibody",
    body: "A negative autocontrol supports an alloantibody pattern, but does not prove it by itself. A positive autocontrol or DAT raises concern for autoantibody, recent transfusion, or another mixed picture.",
  },
  {
    title: "Clinical significance",
    body: "Rh, Kell, Duffy, and Kidd are commonly cited clinically significant systems because they can shorten red cell survival or cause HDFN.",
  },
];

export default function GuidePage() {
  return (
    <div className="page learn-page">
      <section className="hero guide-hero">
        <div className="hero-copy guide-hero-copy">
          <p className="eyebrow">Full guide</p>
          <h1>Antibody identification from basics to complete panel strategy.</h1>
          <p className="lede">
            This page is the deeper reference. It covers the blood bank basics,
            antibody classes, clinically significant systems, phases, dosage,
            enzyme effects, autocontrol and DAT interpretation, and the practical
            steps used to work through a blood bank antibody identification case.
          </p>
          <div className="actions">
            <Link className="button" href="/practice">
              Go to practice
            </Link>
            <Link className="button secondary" href="/">
              Back to quick start
            </Link>
          </div>
        </div>

        <aside className="hero-note card">
          <p className="card-label">Quick reminders</p>
          <ul className="compact-list">
            {quickFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </aside>
      </section>

      <nav className="guide-nav" aria-label="Guide sections">
        <a href="#basics">Basics</a>
        <a href="#significance">Clinical significance</a>
        <a href="#phases">Phases</a>
        <a href="#systems">Systems</a>
        <a href="#ruleout">Rule-out</a>
        <a href="#rulein">Rule-in</a>
        <a href="#dat">DAT</a>
        <a href="#enzymes">Enzymes</a>
        <a href="#context">Context</a>
        <a href="#strategy">Strategy</a>
        <a href="#glossary">Glossary</a>
        <a href="#references">References</a>
      </nav>

      <section className="section" id="basics">
        <div className="section-heading">
          <p className="eyebrow">Core topics</p>
          <h2>Blood bank basics before opening a panel.</h2>
          <p>
            Antibody identification compares a patient&apos;s serum or plasma
            with reagent red cells that have known antigen profiles. The goal
            is to identify likely antibody specificity, decide whether it is
            clinically significant, and select compatible donor blood if needed.
          </p>
        </div>
        <div className="grid grid-4">
          {additionalTopics.map((topic) => (
            <article className="card" key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="significance">
        <div className="section-heading">
          <p className="eyebrow">Clinical significance</p>
          <h2>Which antibodies matter and why.</h2>
          <p>
            Clinically significant antibodies are the ones that can shorten
            red cell survival or cause hemolytic disease of the fetus and
            newborn. In many routine workups, that means looking for
            antibodies that react at 37°C and/or AHG.
          </p>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Usually important</h3>
            <p>Rh, Kell, Duffy, and Kidd are common high-yield systems.</p>
          </article>
          <article className="card">
            <h3>Usually less important</h3>
            <p>Lewis antibodies are often colder and less clinically significant, though some exceptions are clinically important.</p>
          </article>
        </div>
      </section>

      <section className="section" id="phases">
        <div className="section-heading">
          <p className="eyebrow">Reaction phases</p>
          <h2>What each phase is telling you.</h2>
        </div>
        <div className="table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Meaning</th>
                <th>How to think about it</th>
              </tr>
            </thead>
            <tbody>
              {phaseRows.map((row) => (
                <tr key={row.phase}>
                  <td>{row.phase}</td>
                  <td>{row.meaning}</td>
                  <td>{row.take}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" id="systems">
        <div className="section-heading">
          <p className="eyebrow">Major systems</p>
          <h2>The systems you should recognize first.</h2>
        </div>
        <div className="system-grid">
          {systems.map((system) => (
            <article className="card system-card" key={system.name}>
              <div className="system-header">
                <h3>{system.name}</h3>
                <span className="system-badge">High yield</span>
              </div>
              <p>{system.summary}</p>
              <p className="system-reason">{system.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Pattern recognition</p>
          <h2>Common antibody behaviors worth memorizing.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Rh, Duffy, Kidd</h3>
            <ul className="compact-list">
              <li>Rh antibodies are often warm and may show dosage.</li>
              <li>Duffy antibodies are dosage-sensitive and enzyme sensitive.</li>
              <li>Kidd antibodies can be weak, variable, and delayed or evanescent.</li>
            </ul>
          </article>
          <article className="card">
            <h3>Kell and Lewis</h3>
            <ul className="compact-list">
              <li>Kell antibodies are often strong and clinically important, but serology can vary.</li>
              <li>Lewis antibodies are often colder and often less significant.</li>
              <li>Rare Lewis antibodies can still matter if they react at 37°C.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section" id="ruleout">
        <div className="section-heading">
          <p className="eyebrow">Rule-out strategy</p>
          <h2>How nonreactive cells narrow the list.</h2>
          <p>
            Rule-out means using nonreactive cells that are antigen-positive for
            the candidate antibody to exclude that antibody from consideration.
            If dosage is possible, homozygous cells matter because they are
            better at showing weak reactions.
          </p>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Why homozygous cells matter</h3>
            <p>
              Some antibodies show dosage. A cell with two copies of an antigen
              may react more strongly than a heterozygous cell.
            </p>
          </article>
          <article className="card">
            <h3>What a nonreactive cell tells you</h3>
            <p>
              If a cell does not react and it carries the antigen, the matching
              antibody becomes less likely. Use enough clean nonreactive cells
              to make the exclusion believable.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="rulein">
        <div className="section-heading">
          <p className="eyebrow">Rule-in and dosage</p>
          <h2>How to prove the best-fit antibody.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Rule of 3</h3>
            <p>
              One common teaching standard is to find at least 3 positive cells
              and 3 negative cells that support the antibody pattern. That
              increases confidence that the fit is real.
            </p>
          </article>
          <article className="card">
            <h3>Dosage effect</h3>
            <p>
              Dosage means an antibody reacts more strongly with homozygous
              antigen expression than with heterozygous expression.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="dat">
        <div className="section-heading">
          <p className="eyebrow">Autocontrol and DAT</p>
          <h2>Separating alloantibodies from autoantibodies.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Autocontrol</h3>
            <p>
              The autocontrol compares the patient&apos;s serum with the
              patient&apos;s own red cells. A negative result supports an
              alloantibody pattern, but it does not prove it by itself.
            </p>
          </article>
          <article className="card">
            <h3>DAT</h3>
            <p>
              The direct antiglobulin test looks for IgG and/or complement
              already attached to red cells in vivo. A positive result makes
              you think about autoantibody, hemolysis, HDFN, or recent transfusion.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="enzymes">
        <div className="section-heading">
          <p className="eyebrow">Enzyme effects</p>
          <h2>What ficin and papain change.</h2>
        </div>
        <div className="table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>Effect</th>
                <th>Examples</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {enzymeEffects.map((row) => (
                <tr key={row.effect}>
                  <td>{row.effect}</td>
                  <td>{row.examples}</td>
                  <td>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" id="context">
        <div className="section-heading">
          <p className="eyebrow">Clinical context</p>
          <h2>History matters as much as the panel.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Ask about transfusion and pregnancy</h3>
            <p>
              Exposure from transfusion or pregnancy is a common reason a
              patient develops an alloantibody. It also helps explain why a
              previously negative patient now has a positive screen.
            </p>
          </article>
          <article className="card">
            <h3>Think about hemolysis and recent events</h3>
            <p>
              A history of anemia, jaundice, hemolysis, recent transfusion, or
              suspected autoimmune disease changes how you interpret the workup.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="strategy">
        <div className="section-heading">
          <p className="eyebrow">Systematic approach</p>
          <h2>A practical order for working an antibody ID.</h2>
        </div>
        <div className="workflow-panel card">
          <ol className="numbered-list workflow-list">
            {workflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="glossary">
        <div className="section-heading">
          <p className="eyebrow">Glossary</p>
          <h2>The terms a new user needs to recognize quickly.</h2>
        </div>
        <div className="table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>Term</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {glossary.map((item) => (
                <tr key={item.term}>
                  <td>{item.term}</td>
                  <td>{item.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" id="references">
        <div className="section-heading">
          <p className="eyebrow">Open access references</p>
          <h2>Sources used for this study guide.</h2>
        </div>
        <ul className="compact-list references-list">
          {references.map((reference) => (
            <li key={reference.label}>
              <a href={reference.href} target="_blank" rel="noreferrer">
                {reference.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section callout">
        <div>
          <p className="eyebrow">Next step</p>
          <h2>Use the full guide when you want the complete picture, then practice.</h2>
          <p>
            The quick start page gives the essentials. This page gives the
            detailed version. The practice page turns both into panel work.
          </p>
        </div>
        <div className="actions">
          <Link className="button" href="/practice">
            Go to practice
          </Link>
          <Link className="button secondary" href="/">
            Back to quick start
          </Link>
        </div>
      </section>
    </div>
  );
}
