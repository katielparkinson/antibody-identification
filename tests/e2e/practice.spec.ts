import { expect, test } from "@playwright/test";

test("practice panel loads the antibody identification workspace", async ({ page }) => {
  await page.goto("/practice");

  await expect(
    page.getByRole("heading", { name: /rule out antibodies from an 11-cell panel/i }),
  ).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByText(/still possible:/i)).toBeVisible();
});
