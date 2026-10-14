# Quality assurance

## Automated checks

- Effective annual compounding, zero and negative returns, month-end annuity identity, proportional fees, inflation adjustment and invalid inputs.
- All 101 integer allocation values across all ten categories; allocations always total exactly 100%, including single-asset corner cases.
- Synthetic weighted shocks, severity boundaries and leveraged losses beyond initial equity.
- All ten categories, localized required fields, bilingual glossary, valid source IDs and qualitative score bounds.
- Finite geometry, valid bounding volumes, downward ray intersections in every district, distinct model geometry and merged draw-call budget.
- Both languages' rendered educational panels, simulators and glossary; stored preference and allocation recovery, including corrupt data.
- Strict TypeScript compilation, production bundling and repository-relative asset/font paths.

These tests verify calculations, source content and geometry. They do not, by themselves, prove visual layout, device frame rate or real browser event behavior.

## Verification record

- `npm test`: **39 tests passed**, across financial functions, content/geometry and interface/persistence suites.
- `npm run build`: strict TypeScript and Vite production build passed.
- `npm run check:dist`: five entry references, 17 bundled assets, Persian font, lazy 3D chunk and `.nojekyll` passed.
- Static architectural geometry: **74 meshes, 51,610 triangles** before animated details. All ten districts passed ray intersection and finite-coordinate checks.
- Production bundle uses `/Investverse/` for all entry and font asset paths.

Publication and real browser results are added after deployment. Physical Windows/macOS/iPhone/Android device performance has not been certified. No visual or device result is implied by an automated source test.
