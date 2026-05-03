import type { Metadata } from "next";
import Link from "next/link";
import { quickFacts } from "@/lib/learningContent";

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
          <h1>Learn only what you need, then move into practice.</h1>
          <p className="lede">
            This page gives the minimum setup needed to work the practice panel.
            Use the full guide when you want the blood bank background, antibody
            concepts, and deeper explanations of the patterns you will see.
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
        <a href="#strategy">Workflow</a>
        <a href="#marks">Marks</a>
      </nav>

      <section className="section" id="basics">
        <div className="section-heading">
          <p className="eyebrow">Basics</p>
          <h2>What antibody identification is trying to answer.</h2>
          <p>
            The test is about matching patient serum or plasma against reagent
            red cells with known antigen profiles. The goal is to identify
            which antibody or antibodies are present so the panel can be
            interpreted correctly.
          </p>
        </div>
        <div className="grid grid-4">
          <article className="card">
            <h3>Read the pattern first</h3>
            <p>
              Start with the reactive cells, then look for the antibody pattern
              that explains them best.
            </p>
          </article>
          <article className="card">
            <h3>Know the usual clues</h3>
            <p>
              Clinically significant antibodies usually react at 37 C and/or AHG
              (antihuman globulin), and the autocontrol or DAT (direct antiglobulin
              test) can help separate alloantibody from autoantibody or mixed findings.
            </p>
          </article>
          <article className="card">
            <h3>Use nonreactive cells</h3>
            <p>
              Nonreactive antigen-positive cells help rule out unlikely
              antibodies, and dosage-sensitive systems need homozygous cells
              for stronger evidence.
            </p>
          </article>
          <article className="card">
            <h3>Match the panel</h3>
            <p>
              The strongest clue is not one cell, but how the whole panel fits
              together.
            </p>
          </article>
        </div>
      </section>

      <section className="section" id="strategy">
        <div className="section-heading">
          <p className="eyebrow">Workflow</p>
          <h2>A simple order for reading a practice case.</h2>
        </div>
        <div className="split-layout">
          <article className="card">
            <h3>1. Start with the pattern</h3>
            <ul className="compact-list">
              <li>Look at the phase and strength of reactivity.</li>
              <li>Check the autocontrol and DAT.</li>
              <li>Ask whether the case looks like alloantibody, autoantibody, or mixed findings.</li>
            </ul>
          </article>
          <article className="card">
            <h3>2. Rule out and confirm</h3>
            <ul className="compact-list">
              <li>Use nonreactive cells to rule out unlikely antibodies.</li>
              <li>Watch for dosage and homozygous expression.</li>
              <li>Use the reactive and nonreactive cells that fit best to support your final answer.</li>
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

      <section className="section" id="marks">
        <div className="section-heading">
          <p className="eyebrow">Marks</p>
          <h2>The only notation the practice page uses.</h2>
        </div>
        <div className="marks-layout">
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
