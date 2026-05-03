import { expect, test } from "@playwright/test";

test("practice panel loads the antibody identification workspace", async ({ page }) => {
  await page.goto("/practice");

  await expect(
    page.getByRole("heading", { name: /rule out antibodies from an 11-cell panel/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /procedure/i })).toBeVisible();
  await expect(page.getByText(/rule out means/i)).toBeVisible();
  await expect(page.getByText(/het means one antigen copy/i)).toBeVisible();
  await expect(page.getByText(/rule in means enough positive and negative cells/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /answer check/i })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("button", { name: /reveal answer/i })).toBeVisible();

  await page.getByRole("button", { name: /reveal answer/i }).click();

  await expect(page.getByRole("table")).toHaveCount(2);
  await expect(page.getByRole("heading", { name: /your attempt/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /answer key/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /restart/i })).toBeVisible();
});
