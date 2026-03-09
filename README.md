# AlignAI by ByteStream Strategies

Enterprise AI governance website built with Next.js, TypeScript, and TailwindCSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Static Export)
- **Language:** TypeScript
- **Styling:** TailwindCSS with custom design tokens
- **Fonts:** Sora (headings) + Inter (body) via next/font
- **Chat API:** Anthropic Messages API via Netlify Function
- **Deployment:** Netlify (primary) / GitHub Pages (static fallback)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build static export to `out/` |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
app/                  # Next.js App Router pages
  page.tsx            # Home
  framework/          # Governance framework
  services/           # Service offerings
  about/              # About page
  contact/            # Contact page
  insights/           # Blog listing + [slug] detail
  client-access/      # Login card (Phase 1)
components/           # Shared UI components
  Header.tsx          # Fixed navigation header
  Footer.tsx          # Site footer
  CTASection.tsx      # Global call-to-action strip
  ChatWidget.tsx      # Floating chat button
  ChatPanel.tsx       # Chat conversation panel
  BlogCard.tsx        # Insights grid card
  LoginCard.tsx       # Client access login form
lib/
  anthropic.ts        # Anthropic API client helper
data/
  posts.json          # Blog post content
netlify/
  functions/
    chat.ts           # Serverless chat endpoint
styles/
  globals.css         # Tailwind base + component styles
public/
  robots.txt          # Search engine directives
  sitemap.xml         # XML sitemap
  images/             # Static image assets
```

## Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Build settings are configured in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Functions directory: `netlify/functions`
3. Set environment variable `ANTHROPIC_API_KEY` in Netlify dashboard
4. The `/api/chat` path is redirected to the Netlify Function automatically

### GitHub Pages

1. Run `npm run build`
2. Deploy the `out/` directory to GitHub Pages
3. Chat API will not be available (UI-only mode)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | For chat | Anthropic API key for the chat function |

Copy `.env.example` to `.env.local` for local development.

## Design System

### Colors

| Token | Hex |
|-------|-----|
| Navy (Primary) | `#0C1E39` |
| Deep Blue | `#274185` |
| Mid Blue | `#407BB7` |
| Cyan Accent | `#63BCE7` |
| Slate | `#84899A` |
| Light Slate | `#C8CDD8` |
| Off White | `#F4F6F9` |

### Rules

- No gradients anywhere in the UI
- Max container width: 1200px
- Body text max width: 680px
- Section backgrounds alternate: Navy / Off White / White / Off White
- 1px Mid Blue divider between major sections
- Button border radius: 4px

## Chat Widget

- **Phase 1** (current): UI-only with placeholder responses
- **Phase 2**: Set `PHASE_2_ENABLED = true` in `ChatPanel.tsx` and configure `ANTHROPIC_API_KEY` to enable live Anthropic API calls

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigable (skip link, focus outlines, semantic markup)
- Minimum contrast ratio 4.5:1
- Screen reader friendly with ARIA labels and roles
