# Asset provenance and rendering budget

All financial buildings, district props, base architecture, icons and decorative geometry are original procedural assets authored for Investverse. They are generated locally by `src/scenes/districts/models.ts` and `WorldScene.tsx`. The project does not download unlicensed models, use brand logos, or require a model-hosting API. No GLB files are required for these procedural assets.

Each district has its own architecture and animated educational motif:

| District | Architecture | Motion |
| --- | --- | --- |
| Stocks | Framed glass exchange towers, illuminated floor plates, chart facade | Illustrative moving chart bars |
| Real estate | Apartments, detached housing, balconies, crane and landscaping | Rental-income markers |
| Gold | Armored vault, bolts, shelves and metallic bullion | Articulated vault door opens on focus |
| Crypto | Linked polyhedral nodes and server racks | Network transaction packets |
| Bonds | Fixed-income hall, yield display and coupon pillars | Coupon-payment tokens |
| ETFs | Circular basket with six underlying building modules | Diversification flow around the basket |
| Savings | Bank colonnade and stepped stone foundation | Accumulating deposit coins |
| Startups | Three ascending laboratory buildings | Funding-stage flow |
| Mutual funds | Central manager rotunda and underlying asset pods | Allocation flow to holdings |
| REITs | Office, apartment and warehouse portfolio | Rental-distribution flow |

The static city and all districts contain **74 merged material meshes and 51,610 triangles** before animated details. Geometry is merged by material; animated capital and district markers are instanced. This avoids a draw call for every window. Text labels are interactive DOM elements rather than a remote font dependency for 3D text.

Lighting uses a generated Three.js RoomEnvironment PMREM reflection map, hemisphere lighting, a warm key, a cool fill and constrained shadow mapping. There are no external HDR or texture requests. Metallic bullion, glazing, structural metal and stone use physically based materials. All native Three.js geometry is normalized to indexed geometry before material batching.

Fonts are packaged locally by Fontsource: **Space Grotesk, Manrope and Vazirmatn**, distributed under the SIL Open Font License 1.1. Package license files are available in their npm distributions. Lucide interface icons are under the ISC license; district pictograms and the Investverse identity are original. React, React Three Fiber, Drei, Zustand, Vite, Vitest and Three.js retain their respective open-source licenses in their package distributions.

Mobile/adaptive rendering caps device pixel ratio at 1 and disables shadows. High quality uses a capped 1.75 DPR and a 2048² shadow map. The city is lazy-loaded, and no animation updates React state every frame. A WebGL failure offers an accessible 2D atlas with the same educational and simulation tools.

Actual frame rate depends on hardware and browser; no universal 60 FPS claim is made.
