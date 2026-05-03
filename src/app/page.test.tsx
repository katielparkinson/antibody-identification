import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("quick start page", () => {
  it("renders the quick start guidance and the practice-oriented structure", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /learn only what you need/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /what antibody identification is trying to answer/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /the only notation the practice page uses/i })).toBeVisible();
    expect(screen.getByText(/37°c/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /open full guide/i })).toBeVisible();
  });
});
