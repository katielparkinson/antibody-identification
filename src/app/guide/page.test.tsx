import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GuidePage from "./page";

describe("full guide page", () => {
  it("renders the guide structure and source-backed sections", () => {
    render(<GuidePage />);

    expect(screen.getByRole("heading", { name: /antibody identification from basics to complete panel strategy/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /clinical significance/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /how to prove the best-fit antibody/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /sources used for this study guide/i })).toBeVisible();
  });
});
