# Antibody Identification

Antibody Identification is a resume-focused educational Next.js app for practicing classic blood bank antibody identification panels.

The MVP includes:

- A brief learning page explaining antibody identification concepts.
- A practice page with synthetic 11-cell donor panels and an autocontrol.
- Interactive rule-out marking for heterozygous, homozygous, and fully ruled-out states.
- A tested TypeScript rule-out engine based on configurable educational policy.

This project is for education and portfolio demonstration only. It is not medical decision support.

## Development

This project is designed for Bun:

```bash
bun install
bun run dev
```

The current local environment may also run the scripts with npm if Bun is unavailable:

```bash
npm install
npm run dev
```

## Validation

```bash
bun run db:seed
bun run typecheck
bun run lint
bun run test
bun run build
```

## Docker Compose

Development:

```bash
docker compose -f compose.dev.yml up
```

Then open http://localhost:3005.

Production:

```bash
docker compose -f compose.prod.yml up -d --pull always
```
