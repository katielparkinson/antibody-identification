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
        <PracticePanel />
      </section>
    </div>
  );
}
