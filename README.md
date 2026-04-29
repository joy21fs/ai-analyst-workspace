_A recreation of core features I built over 3 years in production — rebuilt in ~30 minutes using Cursor and AI-assisted development.
_
## AI Data Analyst Workspace (frontend-first)

Portfolio app built with **Next.js + React + TypeScript** to demonstrate:

- **Streaming chat UX** (simulated streaming) + **tool outputs**
- **Data visualizations** (bar/line/pie) + **flowcharts**
- **Connector management** UI (CRUD + “Test connection” + simulated realtime refresh)
- **Mocked REST + GraphQL** APIs with **MSW**
- **Component library** with **Storybook**
- **Tests** with **Vitest** (jsdom) + MSW node server

## Demo
- Screencasts:
1. `/account`: switch roles and observe gated actions 

https://github.com/user-attachments/assets/ae0848e7-b7bc-4019-bc06-656fc196baf8


2. `/connectors`: create and test a connector 

https://github.com/user-attachments/assets/52d24be0-5bf6-475d-9f07-9736045fa0c1


3. `/workspace`: generate and save charts 

https://github.com/user-attachments/assets/e51232aa-f809-4f84-96e9-4e71e40f2e66


## Built with Cursor-assisted development
This project was built with **Cursor (AI-assisted development)**, while I kept ownership of decisions and quality:
- Used AI to accelerate: initial architecture drafts, component breakdown, typed data layer, testing scaffolding, and documentation
- Human-reviewed and refined: naming/readability, state/error handling, maintainability, avoiding over-abstraction
- Kept changes reviewable: work is split into small, semantic commits for easy review and rollback
- Runs end-to-end without real backend/API keys (MSW mocks REST/GraphQL), so reviewers can validate quickly

## Getting Started

### Run the app

```bash
cd ai-analyst-workspace
pnpm dev
```

Open `http://127.0.0.1:3000`.

### Run Storybook

```bash
cd ai-analyst-workspace
pnpm storybook --port 6006
```

Open `http://localhost:6006`.

### Run tests

```bash
cd ai-analyst-workspace
pnpm test
```

## What to demo

- **Landing**: `/`
- **Workspace**: `/workspace`
  - Send prompts like:
    - `bar chart of revenue by month`
    - `line chart of revenue by month`
    - `pie chart of revenue by region`
    - `flowchart connector run`
  - Click **Save** on a chart card to persist an insight
- **Connectors**: `/connectors`
  - Create a connector and click **Test**
  - Name a connector with `fail` to see an error state (simulated)
- **Account**: `/account`
  - Change role and see gated actions

## Architecture (quick skim)

- `src/domain/`: core domain types (`Dataset`, `Connector`, `Insight`, `ChatMessage`, `VizSpec`)
- `src/api/`: REST + GraphQL clients and React Query hooks
- `src/mocks/`: MSW handlers + in-memory mock DB (REST + GraphQL)
- `src/components/`: reusable UI components (with `.stories.tsx`)
- `src/features/`: feature modules (`chat`, `connectors`, `viz`, `account`)

## Notes

- In development, MSW starts automatically in `src/app/providers.tsx` and mocks `/api/*`.
- The “streaming” chat is intentionally frontend-driven (deterministic) so the project runs without real API keys.

