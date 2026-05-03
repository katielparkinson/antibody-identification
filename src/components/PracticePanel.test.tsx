import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PracticePanel } from "./PracticePanel";

describe("PracticePanel", () => {
  it("shows a side-by-side comparison view after reveal", () => {
    render(<PracticePanel />);

    expect(screen.getAllByRole("table")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /reveal answer/i }));

    expect(screen.getAllByRole("table")).toHaveLength(2);
    expect(screen.getByRole("article", { name: /your attempt/i })).toBeVisible();
    expect(screen.getByRole("article", { name: /answer key/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /restart/i })).toBeEnabled();
  }, 15000);

  it("restarts the active case after reveal", () => {
    render(<PracticePanel />);

    fireEvent.click(screen.getByRole("button", { name: /reveal answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /restart/i }));

    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /reveal answer/i })).toBeVisible();
  }, 15000);

  it("allows proof marks without choosing a final answer first", () => {
    render(<PracticePanel />);

    const proofButton = screen.getAllByRole("button", { name: /proof mark blank/i })[0];
    fireEvent.click(proofButton);

    expect(screen.getAllByRole("button", { name: /proof mark \+/i }).length).toBeGreaterThan(0);
  }, 15000);

  it("highlights mismatched proof cells after reveal", () => {
    render(<PracticePanel />);

    const proofButton = screen.getAllByRole("button", { name: /proof mark blank/i })[0];
    fireEvent.click(proofButton);
    fireEvent.click(screen.getByRole("button", { name: /reveal answer/i }));

    const updatedProofButton = screen.getAllByRole("button", { name: /proof mark \+/i })[0];
    expect(updatedProofButton.closest("td")).toHaveClass("comparison-mismatch");
  }, 15000);
});
