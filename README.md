# INVESTVERSE

### A new perspective on investing.

An interactive, bilingual 3D financial metropolis. Explore ten investment districts, experiment with a virtual portfolio, visualize compound growth, and understand the other side of risk.

**Website:** https://saaeiddev.github.io/Investverse/

**Created by Amir Saeid Dehghan** · https://amirsaeiddehghan.ir

## Experience

- **Explore:** orbit and zoom a floating architectural city; select a building or label to focus its district and open its educational guide.
- **Ten distinct districts:** stocks, real estate, gold, crypto, bonds, ETFs, savings, startups, mutual funds and REITs.
- **Portfolio lab:** redistribute a fictional budget with integer percentage sliders or numeric inputs. The total always stays exactly 100%. District scale follows your allocation.
- **Growth:** initial investment, month-end contributions, duration, effective annual return, proportional annual fees and inflation. Inspect exact yearly values using the chart or its keyboard-accessible year slider.
- **Risk lab:** fictional market, rate and liquidity shocks; adjust severity, leverage and foreign-currency exposure. See asset shocks, hypothetical portfolio impact and eight risk explanations.
- **Compare:** choose up to three districts, rotate their 3D models, and compare mechanics, risks, liquidity, horizons and costs.
- **Learn:** 30 bilingual glossary terms, bookmarked districts and linked primary education sources.
- **Guided tour:** optional 10-district camera tour with pause, previous, next and stop controls.
- **Settings:** English/Persian, RTL, graphics quality, reduced motion, opt-in UI sound and fictional currency labels.

English is the default. Select **FA** to switch instantly to Persian. Settings, bookmarks and virtual allocation are saved in this browser. Budgets and growth inputs are deliberately not persisted. There is no account, analytics service, backend, live market feed or API key.

## Run locally

Requires **Node.js 22.12+** (Node 24 also supported) and npm.

```bash
git clone https://github.com/saaeiddev/Investverse.git
cd Investverse
npm ci
npm run dev
```

Open **http://localhost:4173/Investverse/**.

```bash
npm test            # calculations, allocation, data, geometry, rendered content, persistence
npm run build       # strict TypeScript check, then Vite production build
npm run check:dist  # verify production entry, font and asset paths
npm run preview    # serve the production build locally
```

## GitHub Pages

The existing repository is **saaeiddev/Investverse**. The Vite base is `/Investverse/`; navigation uses hash fragments such as `#growth`, so refreshes do not require a server-side router.

In GitHub **Settings → Pages → Build and deployment**, use **GitHub Actions** as the source. `.github/workflows/deploy.yml` checks and builds pushes to `main`, uploads `dist`, and deploys it using GitHub's official Pages actions. Pull requests run the build checks without publishing. A deployment requires the repository's Pages feature and workflow permissions to be enabled.

To use a different repository path or a custom root domain, update `base` in `vite.config.ts` and the production-path assertions in `scripts/check-build.mjs` together. No runtime environment secrets are needed.

## Architecture

```
src/
  App.tsx                       navigation, city shell, guided tour
  components/ui/                education, simulators, comparisons, glossary, settings
  data/investments.ts            bilingual content, qualitative scores, source registry
  i18n/useI18n.ts                localized text, numbers and currency formatting
  scenes/WorldScene.tsx          React Three Fiber world, controls, motion and fallback
  scenes/districts/models.ts     original detailed procedural architecture
  store/useStore.ts             typed Zustand state and validated local persistence
  styles/app.css                responsive visual system and Persian RTL
  utils/finance.ts              pure financial and allocation functions
tests/                          automated domain and integration checks
docs/                           financial conventions, asset licensing and QA record
.github/workflows/deploy.yml     production build and Pages deployment
```

React + TypeScript + Vite, Three.js + React Three Fiber + Drei, Zustand, local Fontsource fonts and Lucide UI icons. The SVG chart is custom, interactive and keyboard accessible. All 3D geometry is generated locally; no external models or texture servers are needed. See [asset provenance](docs/ASSETS.md) and [simulation definitions](docs/CALCULATIONS.md).

## Interaction and accessibility

- Drag to rotate; scroll/pinch to zoom. A click focuses a building; a drag does not select it.
- Select districts with the sidebar using **Tab** and **Enter**, or use the floating map labels.
- Reset camera or World overview restores the city view.
- Sliders and number fields are native labeled controls; dialogs support Escape and focus management.
- Reduced motion honors the initial system preference and can be changed in settings.
- Responsive layouts adapt navigation and tools to narrow screens. Mobile renders at a capped pixel ratio with shadows disabled.
- If WebGL is unavailable or its context is lost, an accessible 2D atlas retains education, comparison information and simulations.

## Financial integrity

This is general education, not personal investment advice. Virtual mixes and numerical shocks are illustrative; simulated returns are assumptions, never forecasts or guarantees. The 1–5 comparisons are editorial teaching aids, not empirical risk ratings. ETFs and mutual funds are structures whose risks depend on holdings. Deposit insurance, access, taxation and minimum investment terms differ by jurisdiction.

The education is grounded in SEC Investor.gov, FINRA, CFTC, FDIC and ASIC Moneysmart material. See [educational sources](docs/EDUCATIONAL_SOURCES.md). No live prices or claimed historical performance data are used.

## Quality assurance

See [QA.md](docs/QA.md) for the exact checks completed and remaining device-specific limits. The source includes automated allocation, growth, risk, bilingual-content, geometry/raycasting and persistence tests. Build scripts verify that deployed assets resolve beneath the correct repository path. Browser/device claims are recorded only after actual verification.
