import type { Metadata } from "next";
import Link from "next/link";
import { glossary, phaseRows, quickFacts, systems } from "@/lib/learningContent";

export const metadata: Metadata = {
  title: "Antibody Identification | Quick Start",
  description: "A concise introduction to antibody identification before moving into practice.",
};

export default function Home() {
  return (
    <div className="page learn-page">
      <section className="hero guide-hero">
        <div className="hero-copy guide-hero-copy">
          <p className="eyebrow">Quick start</p>
          <h1>Learn the essentials, then move into the full guide or practice.</h1>
          <p className="lede">
            If you are new to blood banking, this is the fastest path to
            understanding antibody identification. Read the essentials here,
            open the full guide when you want depth, and then use the practice
            page to apply the workflow to panels.
          </p>
          <div className="actions">
            <Link className="button" href="/guide">
              Open full guide
            </Link>
            <Link className="button secondary" href="/practice">
              Go to practice
            </Link>
          </div>
        </div>

        <aside className="hero-note card">
          <p className="card-label">What to remember first</p>
          <ul className="compact-list">
            {quickFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </aside>
      </section>

      <nav className="guide-nav" aria-label="Learn page shortcuts">
        <a href="#basics">Basics</a>
        <a href="#systems">Big systems</a>
        <a href="#strategy">Workflow</a>
        <a href="#glossary">Glossary</a>
      </nav>

      <section className="section" id="basics">
        <div className="section-heading">
          <p className="eyebrow">Basics</p>
          <h2>What antibody identification is trying to answer.</h2>
          <p>
            The test is about matching patient serum or plasma against reagent
            red cells with known antigen profiles. The goal is to identify
            which antibody or antibodies are present, whether they are likely
            clinically significant, and what blood should be selected for
            transfusion.
          </p>
        </div>
        <div className="grid grid-4">
          <article className="card">
            <h3>Antibody binding</h3>
            <p>
              Antibodies bind antigens first. Visible agglutination appears
              only when enough bound antibody bridges red cells into a lattice.
            </p>
          </article>
          <article className="card">
            <h3>IgG vs IgM</h3>
            <p>
              IgM often reacts colder and can fix complement strongly. IgG is
              usually the warm, clinically important class that drives most ID workups.
            </p>
          </article>
          <article className="card">
            <h3>Phase matters</h3>
            <p>
              Immediate spin, 37 C, and AHG tell you different things about the
              temperature range and likely significance of the antibody.
            </p>
          </article>
          <article className="card">
            <h3>Pattern matters</h3>
            <p>
              A panel is a pattern-recognition exercise. The strongest clue is
              not one cell, but how the whole pattern fits together.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="systems">
        <div className="section-heading">
          <p className="eyebrow">Big systems</p>
          <h2>Start with the antibodies that matter most.</h2>
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

      <section className="section" id="strategy">
        <div className="section-heading">
          <p className="eyebrow">Workflow</p>
          <h2>A simple order for reading a case.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>1. Check the setup</h3>
            <ul className="compact-list">
              <li>Look at the phase and strength of reactivity.</li>
              <li>Check the autocontrol and DAT.</li>
              <li>Ask whether the case looks like alloantibody, autoantibody, or mixed findings.</li>
            </ul>
          </article>
          <article className="card">
            <h3>2. Narrow the candidates</h3>
            <ul className="compact-list">
              <li>Use nonreactive cells to rule out unlikely antibodies.</li>
              <li>Watch for dosage and homozygous expression.</li>
              <li>Use enzyme behavior to support or weaken a hypothesis.</li>
            </ul>
          </article>
        </div>
        <div className="section-note card">
          <p>
            The full guide goes deeper into rule-of-3 logic, enzyme effects,
            DAT interpretation, and the common patterns for Rh, Kell, Duffy,
            Kidd, and Lewis.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">How to do the panel</p>
          <h2>The procedure the practice page assumes you already know.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Rule out</h3>
            <p>
              Rule out means a nonreactive cell carries the antigen for an
              antibody you are considering. If that cell does not react, that
              antibody becomes less likely. For dosage-sensitive antibodies,
              homozygous cells are stronger rule-out evidence than heterozygous
              cells.
            </p>
            <p>
              In this app, rule-out marks are placed on the antigen cells:
              <strong>Het</strong> means one antigen copy and <strong>Hom</strong>{" "}
              means two antigen copies.
            </p>
          </article>
          <article className="card">
            <h3>Rule in</h3>
            <p>
              Rule in means the overall pattern supports one antibody better
              than the others. A common teaching target is 3 antigen-positive
              reactive cells and 3 antigen-negative nonreactive cells that fit
              the same specificity.
            </p>
            <p>
              In this app, proof marks go on the cell number: <strong>+</strong>{" "}
              for an antigen-positive reactive cell and <strong>-</strong> for an
              antigen-negative nonreactive cell.
            </p>
          </article>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Dosage</h3>
            <p>
              Dosage means an antibody reacts more strongly with cells that have
              two copies of the antigen than with cells that have one copy. That
              is why Rh, Duffy, Kidd, and MNS are classic dosage systems.
            </p>
          </article>
          <article className="card">
            <h3>Status row</h3>
            <p>
              The footer status row is just a running judgment: <strong>Suspect</strong>{" "}
              means possible, <strong>Partial</strong> means some evidence, and{" "}
              <strong>Out</strong> means ruled out.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="glossary">
        <div className="section-heading">
          <p className="eyebrow">Glossary</p>
          <h2>The minimum vocabulary you need to keep going.</h2>
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
              {glossary.slice(0, 5).map((item) => (
                <tr key={item.term}>
                  <td>{item.term}</td>
                  <td>{item.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Quick check</p>
          <h2>Before you move on, remember these signals.</h2>
        </div>
        <div className="table-wrap">
          <table className="info-table">
            <thead>
              <tr>
                <th>Signal</th>
                <th>What it usually suggests</th>
              </tr>
            </thead>
            <tbody>
              {phaseRows.map((row) => (
                <tr key={row.phase}>
                  <td>{row.phase}</td>
                  <td>{row.take}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Next steps</p>
          <h2>Pick the level of detail you want next.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>Full guide</h3>
            <p>
              Use this when you want the complete walkthrough with phase-by-phase
              detail, rule-out strategy, dosage, enzyme effects, and references.
            </p>
            <Link className="button" href="/guide">
              Open the full guide
            </Link>
          </article>
          <article className="card">
            <h3>Practice</h3>
            <p>
              Use this when you want to apply the workflow to panel cases and
              start building speed.
            </p>
            <Link className="button" href="/practice">
              Start practicing
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
