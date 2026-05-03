import Link from "next/link";

const concepts = [
  {
    title: "Start With The Pattern",
    body: "Antibody identification compares patient plasma reactivity against reagent donor cells with known antigen profiles. Nonreactive cells are especially useful because they help exclude antibody specificities.",
  },
  {
    title: "Use Nonreactive Cells To Rule Out",
    body: "If a nonreactive donor cell carries an antigen, the corresponding antibody is less likely. The app tracks those exclusions so the remaining candidates become easier to see.",
  },
  {
    title: "Respect Dosage",
    body: "Some antibodies react more strongly with double-dose antigen expression. For Rh, MNSs, Duffy, and Kidd examples, a homozygous rule-out is stronger than a heterozygous rule-out.",
  },
];

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Blood bank practice</p>
        <h1>Antibody identification for classic panel workups.</h1>
        <p className="lede">
          Learn the basic rule-out workflow, then practice with synthetic
          11-cell donor panels and an autocontrol. This portfolio project is
          educational and is not medical decision support.
        </p>
        <div className="actions">
          <Link className="button" href="/practice">
            Start practice
          </Link>
          <a className="button secondary" href="#workflow">
            Review workflow
          </a>
        </div>
      </section>

      <section className="section" id="workflow">
        <h2>How The Workflow Fits Together</h2>
        <div className="grid">
          {concepts.map((concept) => (
            <article className="card" key={concept.title}>
              <h3>{concept.title}</h3>
              <p>{concept.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>What To Look For</h2>
        <p>
          A negative autocontrol supports an alloantibody pattern. Positive
          panel reactions point toward cells that may carry the target antigen,
          while nonreactive antigen-positive cells support rule-out. The final
          answer should fit the reaction pattern and leave compatible
          antigen-negative donor options.
        </p>
      </section>
    </div>
  );
}
