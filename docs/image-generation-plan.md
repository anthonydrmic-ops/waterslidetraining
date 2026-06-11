# SlideSure lesson imagery - AI generation plan (v2)

## 0. `00-marketing-hero.jpg` - 16:9 - the SlideSure landing page hero

Separate from the lesson set and its calm editorial style - this one is pure
marketing energy (reference: multi-lane racer, riders on tubes mid-splash,
intertwined colourful flumes, deep blue sky). Save as
`public/lesson-images/00-marketing-hero.jpg` and the landing page will be
pointed at it. Do NOT overwrite `01-hero.png` - that stays the lesson style
anchor.

> Ultra-vibrant low-angle action shot from the base of a multi-lane mat
> racer waterslide at a modern Australian water park: two laughing riders on
> inflatable tubes racing down parallel lanes in saturated pink, yellow,
> teal and blue, sheets of white spray frozen mid-splash around them. Above
> and behind, a dense canopy of intertwined fibreglass flumes in magenta,
> lime green, orange and turquoise loops against a deep cobalt summer sky
> with small white clouds, galvanised steel support towers, palm fronds at
> the edges. Shot on a wide 16mm lens, crisp midday sunlight, glossy wet
> fibreglass reflections, high colour saturation, sharp detail, theme-park
> campaign photography.

Negative: distorted limbs, extra fingers, warped or melting flume geometry,
brand logos, readable signage, motion blur on faces, fisheye horizon bend.



Updated 2026-06-11. This supersedes the original 10-image plan. All 10 original
slots are KEPT (branded placeholders are live in `public/lesson-images/`), and
5 new images are added. Two image ideas were reviewed and deliberately
rejected (see "What we will NOT generate").

## Workflow (the golden rules)

1. **Lock the style anchor first.** `01-hero.png` defines the facility: an
   outdoor Australian aquatic leisure centre, white fibreglass flumes with a
   royal-blue interior stripe, eucalyptus-green landscaping, clear mid-morning
   light. Every other image must look like the same photographer shot the same
   facility on the same day.
2. **Image-to-image from the anchor** for every wide/mid shot (Nano Banana Pro /
   Gemini image gen): attach `01-hero.png` as the reference and prompt the new
   scene "at this facility". For 1:1 defect macros use FLUX 1.1 Ultra (raw
   mode) - macros are close enough that the anchor matters less, but keep the
   gelcoat white-with-blue-stripe palette in the prompt.
3. **Swap in place.** Save over the exact placeholder filename (keep `.jpg`,
   except the hero which is `.png`). No code change is needed per swap.
4. **One image per generation session is fine** - the set is built to be
   replaced incrementally as you and your partner work through the content.

### Shared prompt suffix (append to every scene prompt)

> Photorealistic, shot on a 35mm prime, natural Australian daylight, neutral
> colour grade, editorial documentary style for a safety training manual. No
> people looking at camera, no brand logos, no text or signage with gibberish
> lettering, clean uncluttered composition.

### Shared negative guidance

> cartoon, illustration, oversaturated theme-park marketing look, distorted
> hands or limbs, extra fingers, warped geometry on flumes, visible watermark,
> fisheye distortion.

## Existing 10 (unchanged - regenerate to replace placeholders)

| # | File | Aspect | Tool | Subject | Used in |
|---|------|--------|------|---------|---------|
| 1 | `01-hero.png` | 16:9 | Nano Banana Pro | Facility wide shot - flume complex curving to catch pool | Lesson 1-1 opener + marketing page |
| 2 | `02-crack-structural.jpg` | 1:1 | FLUX 1.1 Ultra raw | Through-wall structural crack macro, exposed fibreglass weave | 5-1 Structural Defects |
| 3 | `03-gelcoat-delamination.jpg` | 1:1 | FLUX 1.1 Ultra raw | Gelcoat peeling/delamination macro, lifted edge with shadow | 5-2 Surface Defects |
| 4 | `04-joint-misalignment.jpg` | 1:1 | FLUX 1.1 Ultra raw | Proud joint lip with sealant failure, raking light across the step | 5-3 Joint Failures |
| 5 | `05-mineral-scaling.jpg` | 1:1 | FLUX 1.1 Ultra raw | White-grey calcium scaling band at waterline, rough crust texture | 6-2 Operational Impacts |
| 6 | `06-preopening-inspection.jpg` | 4:3 | Nano Banana Pro | Staff member walking a dry flume at opening, clipboard, hi-vis | 2-1 Daily Pre-Opening |
| 7 | `07-dispatch-position.jpg` | 4:3 | Nano Banana Pro | Top platform, attendant at dispatch station, rider seated waiting | 4-1 Pre-Dispatch Controls |
| 8 | `08-water-testing.jpg` | 4:3 | Nano Banana Pro | Gloved hands holding DPD comparator vial, pink sample, pool behind | 6-1 Why Water Quality |
| 9 | `09-enclosed-flume.jpg` | 16:9 | Nano Banana Pro | Inside an enclosed flume looking downhill, darkness past the bend | 7-1 Collision Scenario |
| 10 | `10-slide-closed.jpg` | 4:3 | Nano Banana Pro | "SLIDE CLOSED" barrier and chain across the stair entry, empty tower | 8-1 Stop Protocols |

## NEW - 5 additions

### 11. `11-fastener-corrosion.jpg` - 1:1 - FLUX 1.1 Ultra raw
Lands in: **2-1 Daily Pre-Opening** (hardware checks) and reusable in 5-1.

> Extreme close-up macro of a stainless steel flange bolt on a white
> fibreglass waterslide joint, early-stage tea staining and a rust weep trail
> running down the gelcoat below the bolt head, water droplets nearby, raking
> morning light exaggerating the surface texture, shallow depth of field.

### 12. `12-pump-room.jpg` - 4:3 - Nano Banana Pro (i2i from hero)
Lands in: **2-2 Water Flow and System Readiness** and reusable in 6-3.

> Interior of a clean aquatic-centre plant room: blue circulation pumps,
> large green sand filter vessels, pressure gauges, labelled PVC pipework and
> a chemical dosing station with safety placards, fluorescent overhead light
> mixed with daylight from a doorway, nobody in frame.

### 13. `13-storm-closure.jpg` - 16:9 - Nano Banana Pro (i2i from hero)
Lands in: **2-4 When to Shut the Slide** (weather triggers).

> The same outdoor waterslide tower under a dark approaching storm front,
> bruised grey-green sky, wind-blown palm fronds, empty queue and pool deck,
> wet concrete reflecting the sky, slide flumes standing out white against
> the dark clouds, dramatic but realistic light.

### 14. `14-dispatch-signal.jpg` - 4:3 - Nano Banana Pro (i2i from hero)
Lands in: **4-2 Dispatch Timing** and reusable in 8-2 Communication.

> Waterslide attendant in uniform polo and hi-vis at the top dispatch
> platform, one hand raised in a clear open-palm STOP signal, the other
> holding a two-way radio, traffic-light dispatch indicator showing red
> beside them, rider seated in the flume entry waiting, shot from slightly
> behind the rider so the attendant and signal are the focus.

### 15. `15-splash-pool.jpg` - 4:3 - Nano Banana Pro (i2i from hero)
Lands in: **4-4 Exit Control and Coordination**.

> Run-out lane and splash pool at the bottom of a fibreglass waterslide,
> clear shallow water with painted depth markings on the pool edge, exit
> steps with handrail, "KEEP EXIT CLEAR" floor signage zone, aerated white
> water at the flume mouth, viewed from the lifeguard's position.

## What we will NOT generate (reviewed and removed)

- **First-aid / injury scenes** (was considered for Module 8): AI renders of
  injured people read as uncanny and undermine the serious tone. The
  EmergencyResponse escalation diagram covers this content better.
- **Crowded mid-ride action shots** (multiple riders inside a flume): highest
  risk of distorted limbs; the collision content is carried by the animated
  dispatch-collision diagram instead.
- Module 1 (legal/standards) stays image-free by design - the interactive WHS
  map diagram is its visual.

## Wiring a new image into a lesson

Files 11-15 are NOT yet referenced in code (no placeholders exist). Once a
file is generated and dropped into `public/lesson-images/`, add a section to
the target lesson in `src/data/training-modules.ts`:

```ts
{
  type: "image",
  imageSrc: "/lesson-images/11-fastener-corrosion.jpg",
  alt: "Early tea staining and a rust weep trail below a flange bolt on a fibreglass flume joint",
  aspect: "1:1",
  body: "Corrosion staining below a joint fastener - exactly what the daily hardware glance is looking for.",
  heading: "What fastener corrosion looks like",
}
```

## QA checklist before accepting an image

- Flumes are white with the royal-blue interior stripe (matches the anchor)
- Lighting plausibly Australian daylight; no theme-park HDR look
- Hands have five fingers; faces are incidental, not the subject
- Any visible text/signage is real English or fully illegible-by-distance
- No watermarks, no logos, no US-style signage (000 not 911 context)
- Defect macros: the defect is unambiguous at thumbnail size
