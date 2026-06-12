# Lesson images

Drop the 10 generated photos here using the EXACT filenames below. Once a file
is in this folder it can be referenced from a lesson section as
`/lesson-images/<filename>` (the `public/` prefix is dropped in the URL).

Save as `.jpg` (photographs compress best as JPEG). If you export `.webp`
instead, update the `imageSrc` in `src/data/training-modules.ts` to match.

| # | Filename | Aspect | Where it goes |
|---|----------|--------|---------------|
| 1 | `01-hero.png` | 16:9 | Module 2 opener + marketing page (real image wired in) |
| 2 | `02-crack-structural.jpg` | 1:1 | Module 6 (Structural), reuse Module 4 |
| 3 | `03-gelcoat-delamination.jpg` | 1:1 | Module 6 / Module 4 (Surface Failures) |
| 4 | `04-joint-misalignment.jpg` | 1:1 | Module 6 (Joint Failures) |
| 5 | `05-mineral-scaling.jpg` | 1:1 | Module 6 / Module 7 |
| 6 | `06-preopening-inspection.jpg` | 4:3 | Module 3, lesson 2-1 |
| 7 | `07-dispatch-position.jpg` | 4:3 | Module 5, lessons 4-1 / 4-2 |
| 8 | `08-water-testing.jpg` | 4:3 | Module 7, lessons 6-1 / 6-3 |
| 9 | `09-enclosed-flume.jpg` | 16:9 | Module 8, lesson 7-1 |
| 10 | `10-slide-closed.jpg` | 4:3 | Module 9, lesson 8-1 |

## Planned additions (not yet generated - see docs/image-generation-plan.md)

These have NO placeholder files and are NOT referenced from any lesson yet.
Generate the file first, drop it here, then wire the section into the lesson.

| # | Filename | Aspect | Where it goes |
|---|----------|--------|---------------|
| 11 | `11-fastener-corrosion.jpg` | 1:1 | Module 3, lesson 2-1 (hardware checks) |
| 12 | `12-pump-room.jpg` | 4:3 | Module 3, lesson 2-2 (system readiness) |
| 13 | `13-storm-closure.jpg` | 16:9 | Module 3, lesson 2-4 (weather shutdown) |
| 14 | `14-dispatch-signal.jpg` | 4:3 | Module 5, lesson 4-2 (dispatch timing) |
| 15 | `15-splash-pool.jpg` | 4:3 | Module 5, lesson 4-4 (exit control) |
| 16 | `16-surface-smooth.jpg` | 4:3 | SurfaceDefects diagram tile 1 (same-shot series, see plan doc) |
| 17 | `17-surface-roughening.jpg` | 4:3 | SurfaceDefects diagram tile 2 (edit of 16) |
| 18 | `18-surface-peeling.jpg` | 4:3 | SurfaceDefects diagram tile 3 (edit of 16) |
| 19 | `19-surface-cracking.jpg` | 4:3 | SurfaceDefects diagram tile 4 (edit of 16) |
| 20 | `20-anemometer.jpg` | 4:3 | Module 3, lesson 2-4 (wind monitoring) |
| 21 | `21-flow-meter.jpg` | 4:3 | Module 3, lesson 2-2 (flow meters) |
| 22 | `22-rider-scales.jpg` | 4:3 | Module 5, lesson 4-1 (weight limits / scales) |

## How an image section looks in a lesson

Add an entry to a lesson's `content` array in
`src/data/training-modules.ts`:

```ts
{
  type: "image",
  imageSrc: "/lesson-images/02-crack-structural.jpg",
  alt: "Hairline-to-through crack across the white gelcoat of a fibreglass flume",
  aspect: "1:1", // "16:9" | "4:3" | "1:1" — defaults to 4:3 if omitted
  body: "A structural crack exposing the fibreglass beneath the gelcoat.", // optional caption
  heading: "What a structural crack looks like", // optional title above the image
}
```

`alt` is important for accessibility and SEO - describe what the photo shows.
`body` renders as a small caption under the image; omit it for a bare image.
