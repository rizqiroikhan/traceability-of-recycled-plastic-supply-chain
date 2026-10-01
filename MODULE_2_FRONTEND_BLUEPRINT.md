# Module 2 Frontend Blueprint

## Product

**Traceability of Recycled Plastic Supply Chain** tracks recycled plastic from collection and processing to its final use. The Module 2 version uses mock data only and focuses on a clear, responsive frontend.

## Target User

Operations and sustainability teams who need to see where a recycled plastic batch came from, its current stage, and its recorded journey.

## Page Plan

1. **`/` — Overview Dashboard**  
   Goal: give users a quick picture of material volume, active batches, completed batches, and recent supply-chain activity.

2. **`/batches` — Batch List**  
   Goal: help users browse and filter recycled plastic batches by material type and status.

3. **`/batches/[id]` — Batch Trace**  
   Goal: show one batch's origin, current status, key details, and journey from collection to final use.

## Visual Identity

- Background: soft off-white `#F7F8F3`
- Primary: forest green `#245B45`
- Accent: recycled blue `#3D7EA6`
- Highlight: warm amber `#D99A3D`
- Text: charcoal `#24302B`
- Feel: clean, trustworthy, sustainable, industrial, and easy to scan
- Style: rounded cards, restrained shadows, clear status badges, and simple icons

Use this visual identity block in every implementation prompt so all pages stay consistent.

## Mock Data Plan

Store sample data in **`lib/batch-data.ts`**, separate from page components.

Each batch should include:

```ts
type BatchStatus = "Collected" | "Processing" | "Ready" | "Delivered";

type Batch = {
  id: string;
  material: "PET" | "HDPE" | "PP";
  source: string;
  weightKg: number;
  status: BatchStatus;
  collectionDate: string;
  currentLocation: string;
  destination: string;
  recycledContentPercent: number;
  journey: {
    stage: string;
    location: string;
    date: string;
    completed: boolean;
  }[];
};
```

Create 8 realistic mock batches with different materials and statuses.

## Shared Layout

- Navbar: product name plus Overview and Batches links
- Desktop: links shown in one row
- Mobile: tidy hamburger menu
- Shared footer: short product description and mock-data notice
- Reusable components: summary card, status badge, batch card, and journey timeline

## Four Questions for Every Prompt

Before sending a prompt to Codex, make sure it answers:

1. **What are we building?** State the exact page, component, or file.
2. **What must it contain?** List the required content and data.
3. **How should it behave?** Describe filters, links, states, and responsive behavior.
4. **How should it look?** Paste the visual identity and consistency requirement.

Ask Codex to fix only one page or issue per prompt.

## Mandatory QC/QA Gate Before Every Commit

Run this gate after each implementation step. Commit only when every applicable check passes.

1. **Scope check**
   - Review the changed files with `git diff --stat` and `git diff`.
   - Confirm the change matches the current prompt and does not modify unrelated pages or behavior.

2. **Feature check**
   - Open the page changed in this step and test its main action.
   - Check links, filters, status badges, dynamic routes, empty states, or not-found states that the change affects.
   - Confirm pages read mock data from `lib/batch-data.ts` instead of duplicating it in components.

3. **Responsive check**
   - Check the changed page at desktop width and at **375px phone width**.
   - Fix anything that wraps badly, overlaps, clips, becomes too small, or causes horizontal scrolling.
   - If shared navigation or layout changed, check all existing pages at both widths.

4. **Browser check**
   - Confirm the page loads successfully and has no browser console errors.
   - Confirm navbar links and page-specific links open the correct routes.

5. **Code check**
   - Run `npm run lint`.
   - Run `npm run build`.
   - Fix any error introduced by the current step before committing.

6. **Commit readiness check**
   - Run `git status` and confirm only intended files are included.
   - Commit with the message assigned to the current step, then push.

Use targeted checks for the page or shared component that changed. Repeat checks across every page only when the change affects shared layout, navigation, styling, or data.

## Prompt 1 — Project Foundation and Mock Data

```text
Prepare the Next.js frontend for the recycled-plastic traceability product.

Create `lib/batch-data.ts` with 8 realistic mock batches using PET, HDPE, and PP. Include source, weight, status, collection date, current location, destination, recycled-content percentage, and journey stages.

Add a shared navbar and footer in the app layout. The navbar links to Overview `/` and Batches `/batches`, with a tidy hamburger menu on mobile.

Visual identity: off-white #F7F8F3, forest green #245B45, recycled blue #3D7EA6, warm amber #D99A3D, charcoal #24302B. Feel clean, trustworthy, sustainable, industrial, and easy to scan.

Keep mock data separate from components. Test desktop and 375px mobile width.
```

Run the mandatory QC/QA gate, then commit:

```bash
git add -A
git commit -m "chore: add frontend foundation and mock batch data"
git push
```

## Prompt 2 — Overview Dashboard

```text
Build the overview dashboard at `/` using `lib/batch-data.ts`.

Show a clear page heading, four summary cards, a batch-status overview, and recent batch activity. Add a CTA linking to `/batches`.

Use the existing visual identity and shared layout. Keep the page easy to scan, responsive at 375px, and free of horizontal overflow. Change only files needed for this page.
```

Run the mandatory QC/QA gate, then commit:

```bash
git add -A
git commit -m "feat: build traceability overview dashboard"
git push
```

## Prompt 3 — Batch List

```text
Build `/batches` using data from `lib/batch-data.ts`.

Show all batches as responsive cards with batch ID, material, source, weight, status, and current location. Add filters for All, PET, HDPE, and PP. Each card links to `/batches/[id]`.

Use the existing visual identity. Use 1 column on phones, 2 on tablets, and 3 on desktop. Test filtering, links, and 375px mobile width.
```

Run the mandatory QC/QA gate, then commit:

```bash
git add -A
git commit -m "feat: add filterable batch list"
git push
```

## Prompt 4 — Batch Trace Detail

```text
Build the dynamic page `/batches/[id]` using `lib/batch-data.ts`.

Show the batch ID, material, source, weight, status, collection date, current location, destination, recycled-content percentage, and a visual journey timeline. Show a clear not-found state for an unknown ID.

Use the existing visual identity. Keep the timeline readable on desktop and 375px mobile width. Change only files needed for this page.
```

Run the mandatory QC/QA gate, then commit:

```bash
git add -A
git commit -m "feat: add batch trace detail page"
git push
```

## Prompt 5 — Final Mobile Polish

```text
Review `/`, `/batches`, and `/batches/[id]` at desktop and 375px mobile width.

Fix only visible consistency or responsive issues: navbar, spacing, card widths, text wrapping, status badges, timeline layout, and horizontal overflow. Keep all content and behavior unchanged.

Run lint and build, then report any remaining issue.
```

Run the mandatory QC/QA gate, then commit:

```bash
git add -A
git commit -m "style: polish responsive traceability frontend"
git push
```

## Final Verification Checklist

- `/`, `/batches`, and a valid `/batches/[id]` page open without console errors
- All pages use data from `lib/batch-data.ts`
- Material filters work
- Every batch card opens the correct detail page
- Unknown batch IDs show a clear not-found state
- Navbar works on desktop and mobile
- No content is clipped and there is no horizontal overflow at 375px
- Colors, typography, cards, and status badges are consistent
- `npm run lint` passes
- `npm run build` passes
- Git history shows foundation, overview, batch list, detail page, and polish as separate commits

## LMS Submission Note

```text
I built three frontend pages for Traceability of Recycled Plastic Supply Chain. The Overview Dashboard summarizes recycled material and recent batch activity. The Batch List helps users browse and filter mock PET, HDPE, and PP batches, while the Batch Trace page shows one batch's origin, details, current status, and journey through the supply chain. The pages use shared mock data, a consistent sustainable visual identity, and responsive layouts for desktop and phone widths.
```

## Submission Reminder

Submit:

1. One screenshot of a completed page running on localhost
2. The GitHub URL of the final commit
3. The LMS submission note above

Final commit URL format:

```text
https://github.com/rizqiroikhan/traceability-of-recycled-plastic-supply-chain/commit/COMMIT-SHA
```
