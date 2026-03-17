## AI Data Analyst Workspace (frontend-first)

Portfolio app built with **Next.js + React + TypeScript** to demonstrate:

- **Streaming chat UX** (simulated streaming) + **tool outputs**
- **Data visualizations** (bar/line/pie) + **flowcharts**
- **Connector management** UI (CRUD + “Test connection” + simulated realtime refresh)
- **Mocked REST + GraphQL** APIs with **MSW**
- **Component library** with **Storybook**
- **Tests** with **Vitest** (jsdom) + MSW node server

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

