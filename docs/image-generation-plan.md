# SlideSure lesson imagery - AI generation plan (v2)

## 0. `00-marketing-hero.jpg` - 16:9 - the SlideSure landing page hero

Separate from the lesson set and its calm editorial style - this one is pure
marketing energy (reference: multi-lane racer, riders on tubes mid-splash,
intertwined colourful flumes, deep blue sky). Save as
`public/lesson-images/00-marketing-hero.jpg` and the landing page will be
pointed at it. Do NOT overwrite `01-hero.png` - that stays the lesson style
anchor.

Nano Banana Pro prompt (positive-only - NB Pro ignores negatives, so the
scene is simplified to one hero structure and the background is defocused
to hide any residual geometry errors):

> Professional theme-park campaign photograph, low angle from the splash
> run-out: two laughing riders on inflatable tubes race down a four-lane
> racing waterslide, the lanes coloured pink, yellow, teal and blue,
> running straight and parallel from a single launch platform at the top
> to the shallow run-out in the foreground, white spray bursting around
> the tubes. Behind the racer, slightly out of focus, one orange enclosed
> flume curves in a single smooth S-bend from that same platform down to
> the ground, held up by straight vertical steel columns. Clear cobalt
> sky, palm fronds at the frame edges, bright midday sun from the upper
> left, glossy wet fibreglass, crisp detail on the riders, soft background
> depth of field.

NB Pro workflow: attach the original REAL reference photo + "Use this photo
as a composition reference: same camera angle and energy." If a seed still
tangles the background, reply to it: "keep everything the same but simplify
the background to just one flume and blur it more" - iterative editing
beats re-rolling. Zero-risk fallback: delete the background flume sentence
and use "Above and behind, only clear cobalt sky and palm fronds."

Tip: use the original REAL photo reference as a structure/composition
reference at ~50-60% strength (never a previous AI output with structural
errors). Generate 4-6 seeds; accept only if every tube can be traced
continuously from platform to ground.



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
| 2 | `02-crack-structural.jpg` | 1:1 | FLUX 1.1 Ultra raw | Tight 2mm dark crack line + spider branches, smartphone inspection-photo style (NOT a gaping fissure - see macro realism note) | 5-1 Structural Defects |
| 3 | `03-gelcoat-delamination.jpg` | 1:1 | FLUX 1.1 Ultra raw | Gelcoat peeling/delamination macro, lifted edge with shadow | 5-2 Surface Defects |
| 4 | `04-joint-misalignment.jpg` | 1:1 | FLUX 1.1 Ultra raw | Proud joint lip with sealant failure, raking light across the step | 5-3 Joint Failures |
| 5 | `05-mineral-scaling.jpg` | 1:1 | FLUX 1.1 Ultra raw | White-grey calcium scaling band at waterline, rough crust texture | 6-2 Operational Impacts |
| 6 | `06-preopening-inspection.jpg` | 4:3 | Nano Banana Pro | Staff member walking a dry flume at opening, clipboard, hi-vis | 2-1 Daily Pre-Opening |
| 7 | `07-dispatch-position.jpg` | 4:3 | Nano Banana Pro | Top platform, attendant at dispatch station, rider seated waiting | 4-1 Pre-Dispatch Controls |
| 8 | `08-water-testing.jpg` | 4:3 | Nano Banana Pro | Gloved hands holding DPD comparator vial, pink sample, pool behind | 6-1 Why Water Quality |
| 9 | `09-enclosed-flume.jpg` | 16:9 | Nano Banana Pro | Inside an enclosed flume looking downhill, darkness past the bend | 7-1 Collision Scenario |
| 10 | `10-slide-closed.jpg` | 4:3 | Nano Banana Pro | "SLIDE CLOSED" barrier and chain across the stair entry, empty tower | 8-1 Stop Protocols |

## Full prompts - scene shots (1, 6-10)

Image 1 first; lock it; attach it as the i2i reference for 6-8 and 10 with
"Same facility as this photo". (9 is an interior - no reference needed.)
Defect macros 2-5 and 11 use the prompts in the macro realism note below.

**1 - `01-hero.png` - 16:9 - the style anchor:**

> Wide establishing photograph of a modern outdoor Australian aquatic
> leisure centre in calm mid-morning light: white fibreglass body-slide
> flumes with a royal-blue interior stripe curving down from a galvanised
> steel tower to a clear catch pool, clean wet pool deck, eucalyptus-green
> landscaping behind, no people, no crowds. Photorealistic, shot on a 35mm
> prime, natural daylight, neutral colour grade, editorial documentary
> style for a safety training manual, sharp detail, no logos or signage.

**6 - `06-preopening-inspection.jpg` - 4:3 - attach image 1:**

> Same facility as this photo. A facility staff member in a navy polo
> shirt and yellow hi-vis vest walking inside the dry white flume at dawn
> before opening, holding a clipboard, looking down inspecting the
> surface, the water turned off, empty park and soft early light behind.
> Photorealistic, 35mm, natural daylight, neutral colour grade, editorial
> documentary style for a safety training manual, face not toward camera,
> no logos.

**7 - `07-dispatch-position.jpg` - 4:3 - attach image 1:**

> Same facility as this photo. The top dispatch platform of the slide
> tower: an attendant in a navy polo and hi-vis vest standing at the
> operator position beside the flume entry, and a rider seated in the
> flume mouth feet-first with arms crossed over their chest, shallow water
> flowing past them, a small red dispatch indicator light on a post,
> handrails around the platform, bright daylight. Photorealistic, 35mm,
> neutral colour grade, editorial documentary style for a safety training
> manual, no faces toward camera, no logos.

**8 - `08-water-testing.jpg` - 4:3 - attach image 1:**
(Modern digital photometer - the Lovibond-style handheld - not the
old-school visual comparator block. No brand.)

> Same facility as this photo. Close view of gloved hands operating a
> compact handheld digital pool water photometer - a small white and blue
> waterproof meter with a backlit LCD screen and a few rubber buttons,
> with a round sample chamber on its top holding a small capped glass vial
> of water tinted faint pink by a dissolved reagent tablet. One hand
> steadies the meter, the other seats the vial in the chamber. The catch
> pool and white flumes softly out of focus behind, bright clean morning
> light. Photorealistic, 35mm, shallow depth of field on the meter,
> neutral colour grade, editorial documentary style for a safety training
> manual, no logos, no readable text - the screen shows only a plain
> number.

**9 - `09-enclosed-flume.jpg` - 16:9 - no reference needed:**

> Interior of an enclosed fibreglass waterslide tube photographed looking
> downhill from inside: a thin sheet of water flowing over the glossy
> curved surface, daylight glowing softly through the translucent blue
> tube wall, the light fading to complete darkness past the bend ahead
> where nothing is visible. Photorealistic, slightly wide lens, neutral
> colour grade, editorial documentary style for a safety training manual,
> empty, no people.

**10 - `10-slide-closed.jpg` - 4:3 - attach image 1:**

> Same facility as this photo. A yellow barrier and chain closing off the
> bottom of the slide tower staircase, a rectangular sign on the chain
> reading SLIDE CLOSED in plain black capital letters, the queue area
> empty, the white flumes above standing dry and idle, flat overcast
> light. Photorealistic, 35mm, neutral colour grade, editorial documentary
> style for a safety training manual, no people, no other text or logos
> anywhere.

(Image 10 is the one deliberate text exception - keep the sign wording to
exactly SLIDE CLOSED; short all-caps text is the only kind generators
render reliably. If it garbles, iterate: "fix the sign text to read SLIDE
CLOSED".)

## Macro realism note (defect images 2-5, 11, 16-19)

FLUX exaggerates defects into CGI-looking canyons if the prompt implies an
opening. Rules learned from generation: (1) frame every defect shot as
"Inspection photograph taken on a smartphone during a waterslide maintenance
check" - candid framing kills the fake studio sheen; (2) state the defect's
real size explicitly ("about two millimetres wide", "a lip a few millimetres
high"); (3) describe cracks as "a sharp dark line", never as gaping or
exposing material; (4) add context wear (light scratches, water droplets,
staining). Negative: torn paper, shattered ceramic, earthquake fissure,
gaping hole, raised broken edges, 3D render, CGI, studio lighting, cartoon.

Every defect prompt starts with "Inspection photograph taken on a
smartphone during a waterslide maintenance check:" and ends with "Realistic
phone-camera look, slightly imperfect framing, true-to-life scale,
documentary record for a safety training manual." Defect cores:

- `02-crack-structural.jpg`: a tight structural crack about two millimetres
  wide running diagonally across the white gelcoat of a fibreglass flume,
  visible as a sharp dark line with tiny chips along its edges and faint
  spider-web hairline branches, slight grey staining along the crack where
  water has penetrated, curved glossy surface with light wear scratches and
  water droplets, soft outdoor daylight.
- `03-gelcoat-delamination.jpg`: a patch of white gelcoat about the size of
  a hand flaking off the curved flume surface, thin brittle flakes lifted a
  few millimetres at their edges, dull slightly fibrous laminate showing
  where flakes have come away, fine blistering at the patch edges,
  surrounding surface glossy with light scratches and droplets.
- `04-joint-misalignment.jpg`: the joint line where two flume sections
  meet, one sitting a few millimetres proud so a small step and lip runs
  across the surface, old sealant cracked and discoloured with a short
  section missing, low raking light making the height difference visible,
  thin film of water on the worn glossy surface.
- `05-mineral-scaling.jpg`: a band of hard-water calcium scale along the
  waterline inside a light-blue flume - a thin, patchy, off-white crust
  like heavy limescale on a kettle or shower screen, gritty like fine
  sandpaper, brightest where thickest and semi-transparent at its thin
  edges, faint grey-tan dirt trapped in the deposit, a speckled spray of
  dried droplet marks above the main band, glossy blue gelcoat showing
  through where thin, a trickle of water below. Extra negatives: snow,
  frost, frosting, foam, barnacles, thick raised crust. (Key realism
  anchor: limescale on a kettle - thin film, never a thick growth.)
- `11-fastener-corrosion.jpg`: a stainless steel hex bolt on a flume flange
  joint, early brown tea-staining on the bolt head and washer, a thin rust
  weep trail a few centimetres long running down the gelcoat below it,
  droplets nearby, surrounding surface glossy with light scratches.

## NEW - 5 additions

### 11. `11-fastener-corrosion.jpg` - 1:1 - FLUX 1.1 Ultra raw
Lands in: **2-1 Daily Pre-Opening** (hardware checks) and reusable in 5-1.

> Extreme close-up macro of a stainless steel flange bolt on a white
> fibreglass waterslide joint, early-stage tea staining and a rust weep trail
> running down the gelcoat below the bolt head, water droplets nearby, raking
> morning light exaggerating the surface texture, shallow depth of field.

### 12. `12-pump-room.jpg` - 4:3 - Nano Banana Pro (i2i from hero)
Lands in: **2-2 Water Flow and System Readiness** and reusable in 6-3.

SAFETY-CORRECT LAYOUT REQUIRED: chlorine products and acid must read as
clearly segregated (AS 3833 / Safe Work Australia: minimum 3m separation,
separate bunds at 110% volume - mixed, they produce chlorine gas). The
prompt places them on opposite walls with the pumps between them.

> Interior of a clean, well-organised aquatic-centre plant room: blue
> circulation pumps and large green sand filter vessels with pressure
> gauges in the centre of the room, labelled PVC pipework overhead. On the
> far left wall, a bunded chemical bay holding white drums of chlorine
> dosing solution standing inside a yellow spill-containment bund with
> hazard placards on the wall above. On the far right wall, several metres
> away on the opposite side of the room, a completely separate bunded bay
> with acid containers and its own different placards. The two chemical
> bays clearly distant from each other with the pumps between them.
> Ventilation grilles, clean sealed floor, fluorescent light mixed with
> daylight from a doorway, nobody in frame. Photorealistic, 35mm, neutral
> colour grade, editorial documentary style for a safety training manual,
> no readable brand names.

Caption when wired in: teach the segregation (chlorine and acid on
opposite sides, own bunds - mixed they make chlorine gas).

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

## 16-19. Surface severity series - 4:3 - Nano Banana Pro (edit chain)

Replaces the abstract tiles in the SurfaceDefects diagram with a same-shot
photo sequence. THE RULE: generate 16 (smooth) first, then produce 17-19 as
EDITS of 16 - same camera, same lighting, same flume, only the surface
worsens. Flick between them like a flipbook to QA; defect must read at
thumbnail size.

- `16-surface-smooth.jpg` - base: "Mid-distance photograph looking down the
  open trough of a light-blue fibreglass waterslide flume section, even
  outdoor daylight, a thin sheet of water flowing over flawless glossy
  gelcoat, clean specular highlights, zero defects, camera angled 45 degrees
  so the flume interior fills the frame."
- `17-surface-roughening.jpg` - edit: gelcoat along the rider line dull and
  matte, fine sandpaper roughness, chalky UV-fading streaks, gloss gone in
  the worn band only.
- `18-surface-peeling.jpg` - edit: blue gelcoat flaked and peeled along the
  rider line, irregular white fibreglass laminate exposed, lifted flake
  edges casting small shadows.
- `19-surface-cracking.jpg` - edit: branching structural crack network, one
  main fracture with hairline branches, grey darkening along crack lines
  where water has penetrated.

Negative for all four: people, hands, logos, text, warped flume geometry,
cartoon, changed camera angle, changed lighting.

## 20-22. Equipment shots for the new safety content - 4:3 - Nano Banana 2

Support the wind / flow meter / weight limit content added 2026-06-12. Use
the i2i facility reference where the facility is visible.

- `20-anemometer.jpg` (-> lesson 2-4 wind section): "Inspection photograph
  taken on a smartphone: a small cup anemometer and wind sensor mounted on
  the handrail of a waterslide tower's top platform, spinning slightly
  blurred, white flumes and pool deck far below, clear sky behind.
  Realistic phone-camera look, documentary record for a safety training
  manual."
- `21-flow-meter.jpg` (-> lesson 2-2 flow meter section): "Inspection
  photograph taken on a smartphone in an aquatic-centre plant room: an
  inline magnetic flow meter with a small digital display mounted on blue
  PVC supply pipework, valve handles nearby, the display showing a clear
  numeric reading, fluorescent light. Realistic phone-camera look,
  documentary record for a safety training manual. No readable brand
  names."
- `22-rider-scales.jpg` (-> lesson 4-1 weight section): "Photograph at the
  dispatch platform of a raft waterslide: a flat platform scale set into
  the deck beside the raft loading position, a simple digital weight
  display on a post beside it, wet concrete, handrails, flume entry softly
  out of focus behind, no people. Editorial documentary style for a safety
  training manual, natural daylight, no logos."

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
