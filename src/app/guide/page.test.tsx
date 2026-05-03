import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GuidePage from "./page";

describe("full guide page", () => {
  it("renders the guide structure and source-backed sections", () => {
    render(<GuidePage />);

    expect(screen.getByRole("heading", { name: /antibody identification from basics to complete panel strategy/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /clinical significance/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /how to prove the best-fit antibody/i })).toBeVisible();
    expect(screen.getByText(/nonreactive cells that are antigen-positive for the candidate antibody/i)).toBeVisible();
    expect(screen.getByText(/a negative autocontrol supports an alloantibody pattern/i)).toBeVisible();
    expect(screen.getAllByText(/37°c/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /sources used for this study guide/i })).toBeVisible();
  });
});
