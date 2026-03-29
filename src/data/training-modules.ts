export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: "knowledge" | "scenario" | "defect";
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: LessonSection[];
  keyTakeaways: string[];
  quiz?: QuizQuestion[];
}

export interface LessonSection {
  heading?: string;
  body: string;
  type: "text" | "warning" | "critical" | "checklist" | "oem-reference";
  items?: string[];
  source?: string;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const modules: Module[] = [
  {
    id: "system-understanding",
    number: 1,
    title: "System Understanding",
    subtitle: "What You're Actually Operating",
    description:
      "Understand the waterslide as an engineered system — flume, joints, supports, hydraulics — and the responsibilities that come with operating it.",
    icon: "blueprint",
    color: "#0891b2",
    lessons: [
      {
        id: "1-1",
        title: "What You're Actually Operating",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "A waterslide is not a simple recreational fixture. It is an engineered system made up of multiple interdependent components, each of which must function correctly for the ride to be safe. Understanding this system is the foundation of everything else in this training.",
          },
          {
            heading: "Slide as a System",
            type: "text",
            body: "Every waterslide consists of these core components working together:",
          },
          {
            type: "checklist",
            body: "Core system components:",
            items: [
              "Flume — The fiberglass reinforced plastic (FRP) channel riders travel through. Subject to UV degradation, mineral deposits, friction wear, and structural cracking.",
              "Joints — Connections between flume sections. Filled with flexible polyurethane sealant (e.g. Sikaflex 1a) to accommodate thermal expansion and contraction.",
              "Support Structure — Steel or concrete framework holding the flume at correct angles and elevations. Subject to corrosion and fatigue.",
              "Hydraulic System — Pumps, pipes, nozzles, and flow control that deliver water to the flume. Correct flow rate must be achieved before any rider enters.",
              "Catch Pool / Runout — The deceleration and exit zone at the base. Must be clear before dispatch.",
              "Tower / Platform — The elevated start position where riders are dispatched. Includes handrails, barriers, and communication systems.",
            ],
          },
          {
            type: "oem-reference",
            body: "ProSlide defines the water ride as a complete system requiring coordinated maintenance across all components. Failure to maintain any single element compromises the entire ride's safety envelope.",
            source: "ProSlide MA-10059, Section 2",
          },
          {
            heading: "Why This Matters",
            type: "text",
            body: "Most incidents don't originate from catastrophic failure. They come from degradation of one component interacting with operational pressure. A slight mineral buildup on the flume surface changes rider speed. A worn joint creates a lip that catches riders. A blocked nozzle creates a dry spot. Understanding the system means understanding how small changes cascade into safety events.",
          },
        ],
        keyTakeaways: [
          "A waterslide is an engineered system, not a simple piece of equipment",
          "Six core components must all function together: flume, joints, supports, hydraulics, catch pool, and tower",
          "Small degradations in any component can cascade into safety incidents",
          "System understanding is the foundation for all operational and maintenance decisions",
        ],
        quiz: [
          {
            id: "q1-1-1",
            question:
              "Which component connects flume sections and must accommodate thermal expansion?",
            options: [
              "Support structure",
              "Joints filled with flexible polyurethane sealant",
              "The catch pool",
              "Handrails",
            ],
            correctIndex: 1,
            explanation:
              "Joints between flume sections are filled with flexible polyurethane sealant (such as Sikaflex 1a) to accommodate expansion and contraction from temperature changes.",
            type: "knowledge",
          },
          {
            id: "q1-1-2",
            question:
              "What must be achieved before any rider is allowed to enter the start position?",
            options: [
              "All staff must be on break rotation",
              "The correct water flow rate must be established",
              "The slide must be visually inspected from the bottom only",
              "Ambient temperature must be above 20 degrees",
            ],
            correctIndex: 1,
            explanation:
              "Per OEM requirements, the correct flow rate and water levels must be achieved and maintained prior to allowing anyone to enter the start position.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "1-2",
        title: "Roles and Responsibilities",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Clear role definition prevents critical tasks from falling through the gaps. OEM manuals explicitly define three tiers of responsibility — and your training must comply with all of them.",
          },
          {
            heading: "Owner / Operator",
            type: "text",
            body: "The Owner/Operator is responsible to operate and maintain the water ride in accordance with their Standard Operating Procedures (SOP) to ensure consistent and safe ride performance. This includes ensuring the staff that operate and maintain the ride are trained and are fulfilling their responsibilities.",
          },
          {
            type: "critical",
            body: "WARNING: Failure to adhere to the inspection and maintenance recommendations of the ride may result in serious injury or death. Failure to follow and maintain documented records will void the manufacturer's warranty.",
            source: "ProSlide MA-10059, Section 5",
          },
          {
            heading: "Maintenance Team",
            type: "checklist",
            body: "The maintenance team is responsible for:",
            items: [
              "Daily pre-opening inspections before every operating day",
              "Ensuring satisfactory completion of all pre-opening inspections and tests before the ride opens",
              "Monitoring water flows and water levels continuously throughout operations",
              "Confirming minimum lighting and ventilation requirements are met",
              "Daily closing inspections",
              "Documentation and record keeping of all maintenance activities",
              "Periodic and annual inspections per manufacturer schedules",
            ],
          },
          {
            heading: "Operations Team",
            type: "checklist",
            body: "The operations team is responsible for:",
            items: [
              "Rider dispatch control and timing",
              "Rider behaviour management and instruction",
              "Exit monitoring and catch pool clearance",
              "Communication between top and bottom positions",
              "Emergency response initiation",
              "Guest safety enforcement",
            ],
          },
          {
            type: "oem-reference",
            body: "Training shall not be limited to inspection and maintenance activities, but must also include identification of hazards, working at heights procedures, PPE requirements, and Safety Data Sheet (SDS) training.",
            source: "ProSlide MA-10059, Section 5.1",
          },
        ],
        keyTakeaways: [
          "Three distinct roles: Owner/Operator, Maintenance Team, Operations Team",
          "Each role has specific, non-overlapping responsibilities",
          "Failure to maintain records voids manufacturer warranty",
          "Training requirements extend beyond basic operations to include hazard identification and PPE",
        ],
        quiz: [
          {
            id: "q1-2-1",
            question:
              "What consequence does the OEM manual explicitly state for failure to follow maintenance recommendations?",
            options: [
              "A fine from the manufacturer",
              "Reduced slide performance only",
              "Serious injury or death, plus voided warranty",
              "A warning letter",
            ],
            correctIndex: 2,
            explanation:
              "ProSlide explicitly warns that failure to adhere to inspection and maintenance recommendations may result in serious injury or death, and failure to maintain records will void the warranty.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "1-3",
        title: "What Fails — Real Failure Modes",
        duration: "15 min",
        content: [
          {
            type: "text",
            body: "Understanding how waterslides fail is essential to preventing failure. Incidents rarely come from a single dramatic event — they develop through accumulated degradation, missed inspections, and operational shortcuts.",
          },
          {
            heading: "Structural Failures",
            type: "text",
            body: "Structural failures involve the physical integrity of the flume and support system. Cracks are signs of structural damage that require immediate attention. Fiberglass must be applied on both sides of the part. If the damage is too severe, the part may need to be replaced. Large fractures in the fiberglass are less common but very serious — a great amount of force must have been applied to cause them.",
          },
          {
            heading: "Surface Failures",
            type: "text",
            body: "Surface conditions directly impact rider safety. Mineral deposits appear as white scale and can cause unsafe rider conditions. Calcium buildup may cause riders to stick, which leads to unpredictable behaviour and unsafe conditions. UV radiation degrades FRP exposed to sunlight — over time, plastics lose colour, strength, and can crack and deteriorate.",
          },
          {
            heading: "Operational Failures",
            type: "checklist",
            body: "The most common operational failure modes include:",
            items: [
              "Dispatch failures — sending a rider before the previous one has cleared the exit zone",
              "Rider non-compliance — incorrect position, standing, spinning, or linking with others",
              "Communication breakdown — loss of contact between top and bottom operators",
              "Flow rate errors — operating with insufficient water, creating dry spots or speed changes",
              "Queue pressure — sacrificing dispatch timing to manage guest volume",
              "Supervision gaps — operator distraction, fatigue, or poor positioning",
            ],
          },
          {
            type: "warning",
            body: "Most slide incidents are not technical failures — they are people failures. The intersection of degraded conditions and operational shortcuts is where incidents occur.",
          },
        ],
        keyTakeaways: [
          "Failures are structural, surface-related, or operational",
          "Structural cracks require immediate attention and may need part replacement",
          "Surface degradation (mineral deposits, UV damage) directly affects rider safety",
          "Operational failures — especially dispatch errors and communication breakdowns — are the most common incident type",
        ],
        quiz: [
          {
            id: "q1-3-1",
            question:
              "A rider unexpectedly stops mid-slide and the next rider collides with them. What is the most likely root cause?",
            options: [
              "The slide was designed incorrectly",
              "Calcium buildup causing the rider to stick, combined with inadequate dispatch timing",
              "The rider was too heavy for the slide",
              "Wind conditions slowed the rider",
            ],
            correctIndex: 1,
            explanation:
              "Calcium buildup on the flume surface can cause riders to stick, leading to unpredictable speed changes. Combined with dispatch timing that doesn't account for surface conditions, this creates collision risk.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "inspections",
    number: 2,
    title: "Inspections",
    subtitle: "Your First Line of Defence",
    description:
      "Master the daily, periodic, and annual inspection procedures that catch problems before they become incidents. Directly from OEM requirements.",
    icon: "clipboard",
    color: "#059669",
    lessons: [
      {
        id: "2-1",
        title: "Daily Pre-Opening Inspection",
        duration: "15 min",
        content: [
          {
            type: "text",
            body: "Every operating day begins with a systematic inspection. This is not a walk-through — it is a structured process that must be completed and documented before any rider enters the slide.",
          },
          {
            type: "oem-reference",
            body: "Prior to operating each day, every individual flume should be inspected by qualified personnel. This inspection should be performed just prior to turning on the water ride's water supply.",
            source: "ProSlide MA-10059, Section 7",
          },
          {
            heading: "Flume Inspection",
            type: "checklist",
            body: "Walk every metre of every flume checking for:",
            items: [
              "Cracks — any crack is a sign of structural damage requiring immediate attention",
              "Chips and gouges — especially on the riding surface",
              "Foreign objects — debris, leaves, insects, vandalism items",
              "Joint condition — sealant failure, separation, sharp edges, lips",
              "Surface condition — mineral deposits, dry rough patches, friction wear",
              "Bolt and fastener integrity — loose, missing, or corroded connections",
            ],
          },
          {
            heading: "Structure Inspection",
            type: "checklist",
            body: "Check all structural elements:",
            items: [
              "Handrails — secure, no sharp edges, proper height",
              "Tower and platform — stable, no movement, drainage clear",
              "Support columns — no visible corrosion, connections tight",
              "Stairs and walkways — non-slip surfaces intact, no damage",
              "Signage — all safety signs present and legible",
            ],
          },
          {
            heading: "Water System Check",
            type: "checklist",
            body: "Before turning on water supply:",
            items: [
              "Check pump operation — no unusual noises or vibration",
              "Open clean-out valves and flush until water runs clear",
              "Check all nozzles are functioning — clean any blocked tips",
              "Achieve correct flow rate and water levels before anyone enters start position",
              "First rider should be a lifeguard or attendant as a final operational check",
            ],
          },
          {
            type: "oem-reference",
            body: "It is recommended that the initial riders be a Lifeguard or Water Ride Attendant. This will act as a final check that the water ride is ready to be ridden by the general public.",
            source: "ProSlide MA-10059, Section 7",
          },
          {
            heading: "Communication and Safety Equipment",
            type: "checklist",
            body: "Before opening:",
            items: [
              "All communication equipment checked and working",
              "Lifesaving equipment present and in working order",
              "Emergency equipment accessible and functional",
              "All lifeguards and attendants in position before public entry",
            ],
          },
        ],
        keyTakeaways: [
          "Every flume must be physically walked and inspected before each operating day",
          "Inspection happens BEFORE water is turned on, not after",
          "Water flow rate must be correct before any rider enters the start position",
          "A staff member should be the first rider as a final operational check",
          "All findings must be documented",
        ],
        quiz: [
          {
            id: "q2-1-1",
            question: "When should the daily flume inspection be performed?",
            options: [
              "After the first hour of operation",
              "Just prior to turning on the water supply",
              "During the lunch break when the slide is quiet",
              "Only when damage is suspected",
            ],
            correctIndex: 1,
            explanation:
              "Per ProSlide requirements, the inspection should be performed just prior to turning on the water ride's water supply — before any water flows.",
            type: "knowledge",
          },
          {
            id: "q2-1-2",
            question:
              "During your pre-opening inspection you find a 5cm crack in the flume surface. What do you do?",
            options: [
              "Note it for the weekly maintenance report",
              "Apply tape over it and continue opening",
              "Immediately report it — cracks are signs of structural damage requiring immediate attention",
              "Monitor it throughout the day to see if it gets worse",
            ],
            correctIndex: 2,
            explanation:
              "Per OEM guidance, cracks are signs of structural damage that require immediate attention. The slide should not operate until the crack has been assessed and repaired.",
            type: "scenario",
          },
        ],
      },
      {
        id: "2-2",
        title: "Water Flow and System Readiness",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Water flow is not just about making the slide work — it is a critical safety control. Incorrect flow creates dry spots where riders decelerate unpredictably, or excessive speed zones where control is lost.",
          },
          {
            heading: "Flow Rate Requirements",
            type: "text",
            body: "The correct flow rate and water levels must be achieved and maintained prior to allowing anyone to enter the start position. Flow rates are specified by the manufacturer for each individual ride and are documented in the Ride Operations Manual. These are not suggestions — they are engineered limits.",
          },
          {
            heading: "Sprinkler System Maintenance",
            type: "checklist",
            body: "For rides with sprinkler/nozzle systems:",
            items: [
              "Turn off pump and open clean-out valves on drop pipes",
              "Allow water to flow until it runs clear",
              "Close clean-out valves on sprinkler pipes",
              "Turn on water and note any jets not functioning properly",
              "Clean non-functioning nozzles by removing tips, cleaning, and replacing",
              "System is ready for use only after all nozzles confirmed operational",
            ],
          },
          {
            type: "critical",
            body: "Operating a slide with incorrect water flow is one of the most dangerous operational errors. Dry spots cause riders to stick, decelerate, and become vulnerable to collision from following riders. This is a non-negotiable operational control.",
          },
        ],
        keyTakeaways: [
          "Flow rates are engineered limits, not suggestions",
          "Water must be running correctly before any rider enters",
          "Blocked nozzles create dry spots that directly cause incidents",
          "Sprinkler systems require systematic flushing and checking",
        ],
      },
      {
        id: "2-3",
        title: "Routine vs Periodic vs Thorough Inspections",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Inspections operate at three distinct levels, each with different scope, frequency, and qualification requirements. Understanding these tiers prevents both under-inspection (missing defects) and over-reliance on daily checks to catch everything.",
          },
          {
            type: "oem-reference",
            body: "ProSlide defines four inspection tiers: Routine (daily), Periodic (monthly/quarterly/yearly), Thorough (by competent professional at defined intervals), and Structural (when damage is suspected).",
            source: "ProSlide MA-10059, Section 4",
          },
          {
            heading: "Routine Inspection (Daily)",
            type: "text",
            body: "Performed by park maintenance staff every operating day. Intended to identify obvious hazards from vandalism, use, excessive wear, weather conditions, foreign bodies, damage, and structural integrity issues before starting operation.",
          },
          {
            heading: "Periodic Inspection (Monthly/Quarterly/Yearly)",
            type: "text",
            body: "More detailed than routine inspection. Performed by park maintenance staff to assess operation and stability of equipment, identify damage, wear, and corrosion. Includes checking all mechanical systems, reviewing maintenance logs, and assessing component lifecycle status.",
          },
          {
            heading: "Thorough Inspection (Professional)",
            type: "text",
            body: "Detailed visual inspection by a competent professional at defined intervals to check all components for signs of wear, structural degradation, corrosion (internal and external) or cracking. May be supplemented by non-destructive testing if deemed necessary.",
          },
          {
            heading: "Structural Inspection (As Needed)",
            type: "text",
            body: "Triggered when damage, distress, or deterioration is suspected or known to exist. The purpose is to determine if the structure or component is structurally adequate to continue operating. This is a specialist assessment, not a staff-level check.",
          },
        ],
        keyTakeaways: [
          "Four tiers: Routine (daily), Periodic (monthly+), Thorough (professional), Structural (specialist)",
          "Daily inspections catch obvious hazards — they don't replace deeper inspection",
          "Periodic inspections assess wear, corrosion, and component lifecycle",
          "Thorough and structural inspections require qualified professionals",
        ],
        quiz: [
          {
            id: "q2-3-1",
            question:
              "You notice surface corrosion on a steel support column during a routine daily inspection. What is the correct response?",
            options: [
              "Paint over it to prevent further corrosion",
              "Document it and escalate for a periodic or thorough inspection by qualified personnel",
              "Ignore it — corrosion is normal on steel",
              "Close the entire water park immediately",
            ],
            correctIndex: 1,
            explanation:
              "Routine inspections identify issues; they don't resolve structural concerns. Corrosion should be documented and escalated to the appropriate inspection tier — periodic or thorough — performed by qualified personnel.",
            type: "scenario",
          },
        ],
      },
      {
        id: "2-4",
        title: "When to Shut the Slide",
        duration: "8 min",
        content: [
          {
            type: "text",
            body: "The decision to shut a slide is one of the most important judgement calls an operator makes. The OEM manuals are clear about non-negotiable shutdown conditions.",
          },
          {
            type: "critical",
            body: "The following conditions require immediate shutdown — no exceptions, no 'monitoring it for a while':",
          },
          {
            type: "checklist",
            body: "Immediate shutdown triggers:",
            items: [
              "Any crack in the flume surface — structural damage requiring immediate attention",
              "Punctures or holes — integrity of the riding surface is compromised",
              "Joint failure — sealant separation creating lips or sharp edges",
              "Incorrect water flow — flow rate below manufacturer specification",
              "Blocked nozzles creating dry zones — unpredictable rider deceleration",
              "Large fractures — especially on bolting flanges critical to structural integrity",
              "Missing or damaged safety signage",
              "Communication system failure between operators",
              "Any condition where the exit zone cannot be confirmed clear",
            ],
          },
          {
            type: "oem-reference",
            body: "Do not use a deficient flume until corrected. Any fractures to the slide component could seriously degrade the structural integrity of the slide section and must be fixed immediately.",
            source: "Waterplay FRP Manual, Section 4",
          },
          {
            type: "warning",
            body: "The cost of shutting a slide is always less than the cost of an incident. Every time. Queue pressure, management pressure, and guest complaints are not valid reasons to keep a compromised slide operating.",
          },
        ],
        keyTakeaways: [
          "Specific conditions require immediate, non-negotiable shutdown",
          "Cracks, punctures, joint failure, and incorrect flow are always shutdown triggers",
          "The cost of closure is always less than the cost of an incident",
          "External pressure to remain open is never a valid safety override",
        ],
      },
    ],
  },
  {
    id: "surface-rider-interaction",
    number: 3,
    title: "Surface and Rider Interaction",
    subtitle: "Where Physics Meets Safety",
    description:
      "Learn why surface condition is a critical safety control — not just cosmetic. From mineral deposits to UV degradation, understand how surface changes create incidents.",
    icon: "waves",
    color: "#d97706",
    lessons: [
      {
        id: "3-1",
        title: "Why Surface Condition Matters",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Surface condition is not cosmetic maintenance — it is a direct safety control. The interaction between the rider's body (or raft) and the flume surface determines speed, control, and predictability. When surface conditions change, rider behaviour becomes unpredictable.",
          },
          {
            type: "oem-reference",
            body: "Washed and waxed surfaces are critical to proper and safe operation. Calcium buildup, for example, may cause riders to stick, which may lead to unpredictable behaviour and unsafe conditions.",
            source: "Waterplay FRP Manual, Section 3.3.2",
          },
          {
            heading: "Mineral Deposits",
            type: "text",
            body: "Water readily dissolves minerals from the ground and carries them as Total Dissolved Solids (TDS). When water evaporates from the flume surface, it leaves behind crystalline mineral deposits — calcium carbonate, calcium sulfate, magnesium compounds, iron, manganese, and others. These deposits appear as white scale ('water spots') and bond aggressively to surfaces. They create rough, high-friction zones that slow or stop riders unpredictably.",
          },
          {
            heading: "The Chemistry of Removal",
            type: "text",
            body: "Mineral deposits are salts. Removing them requires acid mixtures that dissolve the crystalline bonds. No single acid handles all mineral types — a combination is needed. Three variables control the reaction: acid concentration (limited by worker safety), temperature (higher = faster reaction), and time (the main controllable variable in site operations).",
          },
          {
            type: "warning",
            body: "A flume that looks clean can still have microscopic mineral buildup that changes rider dynamics. Regular cleaning and waxing on a 2-3 month cycle is a safety requirement, not just an aesthetic preference.",
          },
        ],
        keyTakeaways: [
          "Surface condition directly controls rider speed, control, and predictability",
          "Mineral deposits cause riders to stick — creating collision risk",
          "Cleaning requires specific acid chemistry, not just soap and water",
          "2-3 month buffing and waxing cycles are a safety requirement",
        ],
        quiz: [
          {
            id: "q3-1-1",
            question:
              "Why is calcium buildup on a flume surface a safety issue rather than just a cosmetic problem?",
            options: [
              "It makes the slide look unattractive to guests",
              "It causes riders to stick, leading to unpredictable speed changes and collision risk",
              "It increases the water bill",
              "It voids the insurance policy automatically",
            ],
            correctIndex: 1,
            explanation:
              "Per the Waterplay manual, calcium buildup may cause riders to stick, which leads to unpredictable behaviour and unsafe conditions — primarily collision risk from following riders.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "3-2",
        title: "Common Surface Failures",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Understanding the types of surface degradation helps you identify problems early and determine the correct response — from routine maintenance to immediate shutdown.",
          },
          {
            heading: "UV Degradation",
            type: "text",
            body: "UV radiation degrades FRP exposed to sunlight. Over time, plastics lose their colour, strength, and can eventually crack and deteriorate, requiring replacement. Waterplay uses UV-inhibiting pigments, but reapplying absorbers and eventually gelcoat is needed over time. On surfaces with UV absorbent clear coat, any refinishing requires a new clear coat application.",
          },
          {
            heading: "Friction Wear",
            type: "text",
            body: "Riders wear down slide surfaces through direct contact. Ideally water separates riders from the surface, but movement causes contact. Airborne dust and metal objects on clothing also scratch surfaces between riders and the flume. These scratches require sanding, filling, and gelcoat reapplication.",
          },
          {
            heading: "Gelcoat Failure",
            type: "text",
            body: "Gelcoat is the protective outer layer of the FRP. When it fails — through peeling, fading, cracking, or wearing through — the structural fiberglass beneath is exposed to water, chemicals, and UV. This accelerates degradation and creates rough surfaces that affect rider safety.",
          },
          {
            heading: "Stickers and Adhesives",
            type: "text",
            body: "Remove stickers with soap and warm water and a soft putty scraper. Residual adhesive creates sticky spots on the riding surface that can catch riders.",
          },
        ],
        keyTakeaways: [
          "UV degradation is progressive — surfaces lose colour, strength, then crack",
          "Friction wear from riders requires periodic sanding and gelcoat repair",
          "Gelcoat failure exposes structural fiberglass to accelerated degradation",
          "Even minor surface issues like sticker residue can affect rider dynamics",
        ],
      },
      {
        id: "3-3",
        title: "Operational Impacts of Surface Changes",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Surface condition changes don't just affect the appearance of the slide — they directly alter how riders move through it. An operator who understands these dynamics can anticipate problems before they become incidents.",
          },
          {
            heading: "Speed Changes",
            type: "text",
            body: "Rough surfaces slow riders. Smooth, freshly waxed surfaces speed them up. Mineral deposits create variable friction zones where riders accelerate and decelerate unpredictably. This makes dispatch timing unreliable because the assumed travel time no longer holds.",
          },
          {
            heading: "Rider Collisions",
            type: "text",
            body: "When a rider decelerates unexpectedly — whether from a rough patch, dry spot, or deposit — the following rider on the original dispatch timing will close the gap. If that gap closes to zero, you have a collision. This is the single most common slide incident pattern.",
          },
          {
            heading: "Rider Stoppages",
            type: "text",
            body: "In severe cases, riders stop completely within the flume. This is extremely dangerous in enclosed slides where following riders cannot see the obstruction. Surface maintenance is directly linked to stoppage prevention.",
          },
          {
            type: "critical",
            body: "If you notice riders moving slower than usual, or if you receive reports of riders stopping, this is a surface condition issue. Do not simply increase dispatch intervals — investigate and address the root cause.",
          },
        ],
        keyTakeaways: [
          "Surface condition directly controls rider speed and predictability",
          "Variable friction zones make standard dispatch timing unreliable",
          "Rider collision from unexpected deceleration is the most common incident pattern",
          "Speed changes require root cause investigation, not just dispatch adjustments",
        ],
      },
    ],
  },
  {
    id: "core-operations",
    number: 4,
    title: "Core Operations",
    subtitle: "The Operator Skillset",
    description:
      "Master the essential operational skills: pre-dispatch checks, rider positioning, dispatch control, and exit monitoring. No fluff — aligned with OEM reality.",
    icon: "controls",
    color: "#7c3aed",
    lessons: [
      {
        id: "4-1",
        title: "Pre-Dispatch Safety Controls",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Pre-dispatch is the last point where you can prevent an incident. Once a rider is moving, your control is limited. Every dispatch decision must confirm three things: the rider is eligible, the slide is ready, and the exit is clear.",
          },
          {
            heading: "Rider Eligibility",
            type: "checklist",
            body: "Before every dispatch, confirm:",
            items: [
              "Height requirement met (as posted for the specific ride)",
              "Weight within range (particularly for raft rides with maximum load limits)",
              "No prohibited items (glasses, jewellery, loose clothing, cameras)",
              "Appropriate swimwear (no clothing with zippers, buckles, or rivets)",
              "No signs of intoxication or impairment",
              "Rider capable of understanding and following instructions",
            ],
          },
          {
            heading: "Slide Readiness",
            type: "checklist",
            body: "Confirm before each dispatch:",
            items: [
              "Water flow is running correctly (listen, observe splash patterns)",
              "No visual obstructions in the entry section",
              "Communication with exit operator is confirmed",
              "Previous rider has completely exited the catch pool",
            ],
          },
          {
            type: "warning",
            body: "Never dispatch based on assumed timing alone. Visual or communicated confirmation of exit clearance is required every single time.",
          },
        ],
        keyTakeaways: [
          "Pre-dispatch is your last control point before the rider is in the system",
          "Three confirmations every time: rider eligible, slide ready, exit clear",
          "Never dispatch on assumed timing — require confirmed clearance",
        ],
        quiz: [
          {
            id: "q4-1-1",
            question:
              "A guest at the top of the slide is wearing sunglasses and a GoPro chest mount. They meet the height requirement. What do you do?",
            options: [
              "Let them ride — they meet the height requirement",
              "Ask them to remove the sunglasses but the GoPro is fine",
              "Require removal of both the sunglasses and camera before dispatch",
              "Ask a supervisor to make the decision",
            ],
            correctIndex: 2,
            explanation:
              "Loose items including glasses and cameras are prohibited. They can detach during the ride, injure the rider or following riders, and create obstructions in the flume.",
            type: "scenario",
          },
        ],
      },
      {
        id: "4-2",
        title: "Dispatch Timing — Risk-Based Decisions",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Dispatch timing is not a fixed number — it is a risk-based decision that must account for real-time conditions. The interval between riders is your primary collision prevention control.",
          },
          {
            heading: "Factors That Affect Dispatch Timing",
            type: "checklist",
            body: "Dispatch intervals should be adjusted for:",
            items: [
              "Water flow rate — reduced flow = slower riders = longer intervals needed",
              "Rider size — heavier riders travel faster; lighter riders (especially children) travel slower",
              "Surface condition — rougher surfaces slow riders unpredictably",
              "Slide type — enclosed slides require longer intervals (no visual confirmation mid-ride)",
              "Weather conditions — wind, rain, and temperature affect rider speed",
              "Time of day — late afternoon heat can dry surfaces faster between riders",
            ],
          },
          {
            heading: "The Collision Physics",
            type: "text",
            body: "A typical adult travels a waterslide at 20-40 km/h. At those speeds, even a 2-second gap closure results in a significant impact. If a preceding rider slows by 30% due to surface conditions, a rider dispatched at 'standard' timing will close a 15-metre gap in seconds. This is why fixed timing alone is insufficient.",
          },
          {
            type: "critical",
            body: "When in doubt, increase the interval. A longer wait never caused a safety incident. A shorter wait has caused hundreds.",
          },
        ],
        keyTakeaways: [
          "Dispatch timing is dynamic, not fixed — adjust for real-time conditions",
          "Six factors affect interval: flow, rider size, surface, slide type, weather, and time of day",
          "Small speed differences close gaps rapidly at slide velocities",
          "When in doubt, increase the interval — longer waits don't cause incidents",
        ],
      },
      {
        id: "4-3",
        title: "Rider Behaviour Control",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Riders do not instinctively know how to ride safely. Your job is to position them correctly and manage their behaviour assertively. This is an active control function, not passive observation.",
          },
          {
            heading: "Correct Riding Positions",
            type: "text",
            body: "Riding position varies by slide type and is specified in the manufacturer's operations manual. Generally: body slides require a supine (lying back, feet first) position. Raft slides have specific seating configurations for single, double, or multi-rider rafts. The rider must be in the correct position before dispatch — not correcting themselves mid-ride.",
          },
          {
            heading: "High-Risk Behaviours to Stop",
            type: "checklist",
            body: "Intervene immediately if a rider attempts to:",
            items: [
              "Stand up at the entry or during the ride",
              "Go head-first (unless specifically designed for it)",
              "Link or chain with other riders",
              "Spin deliberately to change orientation",
              "Hold children on their lap (unless ride-specific rules allow)",
              "Bring objects into the flume",
            ],
          },
          {
            heading: "Communication Technique",
            type: "text",
            body: "Instructions must be clear, assertive, and consistent. Use the same phrasing every time: 'Cross your arms over your chest. Lie back. Feet first.' Repetition builds compliance. If a rider refuses to comply after clear instruction, they do not ride. This is non-negotiable.",
          },
        ],
        keyTakeaways: [
          "Rider positioning is an active control function, not passive",
          "Position must be correct BEFORE dispatch, not corrected mid-ride",
          "Six high-risk behaviours require immediate intervention",
          "Non-compliance after clear instruction = no ride, no exceptions",
        ],
      },
      {
        id: "4-4",
        title: "Exit Control and Coordination",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "The exit zone is where the consequences of every upstream decision play out. The exit operator is the final safety confirmation in the dispatch chain and controls the most dynamic part of the system.",
          },
          {
            heading: "Catch Pool Clearance",
            type: "text",
            body: "The catch pool must be completely clear — no rider in the water, no rider climbing out, no rider standing at the edge — before the exit operator signals dispatch clearance to the top. 'Almost clear' is not clear.",
          },
          {
            heading: "Top-Bottom Coordination",
            type: "text",
            body: "Dispatch operators at the top and exit operators at the bottom form a closed communication loop. The top cannot dispatch without bottom confirmation. The bottom cannot confirm until the exit zone is fully clear. If communication is lost — even momentarily — dispatch must stop until it is restored.",
          },
          {
            heading: "Blind Spots and Delays",
            type: "text",
            body: "Many slide configurations have blind spots — curves, enclosed sections, or elevation changes that prevent direct visual confirmation of the full flume. In these configurations, the exit operator's signal is the only reliable information. Operators must be positioned for maximum visibility of both the exit zone and the flume section they can see.",
          },
          {
            type: "warning",
            body: "Communication system failure is an immediate shutdown trigger. If you cannot confirm exit clearance, you cannot dispatch. There is no workaround for this.",
          },
        ],
        keyTakeaways: [
          "Exit zone must be completely clear before dispatch signal",
          "Top-bottom coordination is a closed loop — both ends must participate",
          "Communication loss = immediate dispatch stop",
          "Operator positioning must maximise visibility of exit zone and flume",
        ],
      },
    ],
  },
  {
    id: "defect-recognition",
    number: 5,
    title: "Defect Recognition",
    subtitle: "See It Before It Fails",
    description:
      "Learn to identify structural defects, surface damage, and joint failures. This is what separates trained operators from generic staff.",
    icon: "magnifier",
    color: "#dc2626",
    lessons: [
      {
        id: "5-1",
        title: "Structural Defects",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Structural defects compromise the physical integrity of the slide. They are the most serious category of defect and often require immediate shutdown and professional repair.",
          },
          {
            heading: "Cracks",
            type: "text",
            body: "Cracks are signs of structural damage that requires immediate attention. They indicate that the FRP has been stressed beyond its design limits. Fiberglass must be applied on both sides of the part for repair. If damage is too severe, the part may need full replacement.",
          },
          {
            heading: "Punctures and Holes",
            type: "text",
            body: "Punctures are defined as any place where a hole has been made in the slide surface from impact with a hard object. This defect must be repaired immediately to maintain the integrity of the slide. Water ingress through punctures accelerates internal degradation.",
          },
          {
            heading: "Large Fractures",
            type: "text",
            body: "Large fractures are less common but very serious. Fiberglass does not tear easily — if it has fractured, significant force was applied. Fractures are usually found on outer edges and bolting flanges, which are critical to structural integrity. Any fracture could seriously degrade the structural integrity of the slide section.",
          },
          {
            type: "critical",
            body: "All structural defects require the slide to be taken out of service immediately. There is no condition under which a cracked, punctured, or fractured flume section should continue operating.",
          },
        ],
        keyTakeaways: [
          "Cracks indicate stress beyond design limits — immediate shutdown",
          "Punctures compromise slide integrity and allow water ingress",
          "Fractures on bolting flanges are critical structural failures",
          "All structural defects = immediate removal from service",
        ],
        quiz: [
          {
            id: "q5-1-1",
            question:
              "You discover a fracture on a bolting flange during your morning inspection. The slide is scheduled to open in 30 minutes and all other slides are fully booked. What do you do?",
            options: [
              "Open the slide but increase dispatch intervals as a precaution",
              "Apply temporary repair and open the slide",
              "Do not open the slide — fractures on bolting flanges critically degrade structural integrity and require professional repair",
              "Open the slide for lighter riders only",
            ],
            correctIndex: 2,
            explanation:
              "Per the Waterplay manual, any fracture could seriously degrade structural integrity and must be fixed immediately. Scheduling pressure is never a valid reason to operate a structurally compromised slide.",
            type: "defect",
          },
        ],
      },
      {
        id: "5-2",
        title: "Surface Defects",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Surface defects affect the riding surface quality and rider safety. While less immediately dangerous than structural defects, they can escalate quickly and contribute to incidents through altered rider dynamics.",
          },
          {
            heading: "Chips and Gouges",
            type: "text",
            body: "Small chips in the gelcoat expose the fiberglass beneath. If left unrepaired, water penetration will cause the chip to expand through osmotic blistering. Gouges are deeper and may affect rider comfort and safety by creating catching points.",
          },
          {
            heading: "Scratches",
            type: "text",
            body: "Surface scratches from riders, maintenance tools, or debris increase local friction. Light scratches can be buffed out. Deeper scratches require filling with gelcoat putty, sanding, and refinishing.",
          },
          {
            heading: "Peeling or Faded Clear Coat / Gelcoat",
            type: "text",
            body: "When the protective clear coat or gelcoat begins peeling or fading, the underlying FRP is exposed to UV, chemicals, and physical wear at an accelerated rate. This requires resurfacing — not just cosmetic attention.",
          },
          {
            heading: "Mineral Buildup",
            type: "text",
            body: "White scale deposits are technically a surface defect that directly affects rider safety. They create variable-friction zones and must be treated with appropriate acid-based cleaning products, not simply scrubbed with soap.",
          },
        ],
        keyTakeaways: [
          "Chips expand through osmotic blistering if not repaired",
          "Scratches increase local friction — buff or fill depending on depth",
          "Gelcoat failure exposes FRP to accelerated degradation",
          "Mineral buildup is a surface defect with direct safety implications",
        ],
      },
      {
        id: "5-3",
        title: "Joint Failures",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Joints between flume sections are engineered connection points that must accommodate thermal movement while maintaining a smooth, continuous riding surface. Joint failure is one of the most common and dangerous maintenance issues.",
          },
          {
            heading: "Sealant Deterioration",
            type: "text",
            body: "Joint sealant (typically flexible polyurethane like Sikaflex 1a or 3M 5200) deteriorates over time from UV exposure, chemical contact, and thermal cycling. When it fails, the joint opens — creating a lip or gap that catches riders.",
          },
          {
            heading: "What NOT to Do with Joints",
            type: "checklist",
            body: "Critical joint maintenance rules:",
            items: [
              "DO NOT use plastic filler that will harden — joints must remain flexible",
              "DO NOT pour lacquer thinner directly onto a joint — it dissolves the sealant",
              "DO NOT put fiberglass over joints — glassed-over joints that crack leave jagged edges that can injure riders",
              "DO NOT leave old filler in place when refilling — remove all old material first",
            ],
          },
          {
            type: "oem-reference",
            body: "Fiberglass sections expand and contract with temperature changes. Use a flexible polyurethane adhesive sealant to fill joints between sections. Joint fills must go from bottom to top with no air pockets covered over by the sealant.",
            source: "Waterplay FRP Manual, Section 3.4",
          },
        ],
        keyTakeaways: [
          "Joints must be flexible — hard fillers cause cracking and rider injury",
          "Sealant deterioration creates lips and gaps that catch riders",
          "Never fibreglass over joints — cracked glass creates cutting edges",
          "Joint refilling requires complete removal of old material first",
        ],
      },
      {
        id: "5-4",
        title: "What Operators Should Do",
        duration: "8 min",
        content: [
          {
            type: "text",
            body: "Operators are the first line of detection. Your role is not to repair defects — it is to identify them, assess their severity, and take the correct immediate action.",
          },
          {
            heading: "The Three-Step Response",
            type: "checklist",
            body: "For any defect identified:",
            items: [
              "REPORT — Document the defect immediately with location, type, size, and photographs where possible",
              "ASSESS — Determine if the defect requires immediate shutdown or can be monitored during operation",
              "ESCALATE — Contact maintenance team, supervisor, or manufacturer depending on severity",
            ],
          },
          {
            heading: "Shutdown vs Monitor Decision",
            type: "text",
            body: "Any structural defect (crack, puncture, fracture) = immediate shutdown. Surface defects (chips, scratches, minor scaling) = document and schedule maintenance. Joint issues = assess severity: minor sealant wear is monitored; any lip, gap, or sharp edge requires immediate shutdown. When in doubt, shut down. You will never be criticised for being too cautious with safety.",
          },
        ],
        keyTakeaways: [
          "Three-step response: Report, Assess, Escalate",
          "Structural defects = always shutdown",
          "Surface defects = document and schedule",
          "Joint issues = assess severity; any lip or sharp edge = shutdown",
        ],
      },
    ],
  },
  {
    id: "water-quality",
    number: 6,
    title: "Water Quality and Performance",
    subtitle: "The Invisible Safety Factor",
    description:
      "Understand how water chemistry affects slide materials, rider safety, and long-term equipment integrity. The connection most training programs miss.",
    icon: "droplet",
    color: "#0284c7",
    lessons: [
      {
        id: "6-1",
        title: "Why Water Quality Matters",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Water quality is not just a public health concern — it directly affects the physical condition of the slide materials, the performance of the ride, and the safety of every rider. This is the connection most training programs completely miss.",
          },
          {
            type: "oem-reference",
            body: "Water quality measurements (including the LSI and FAC levels) must be recorded at minimum on a monthly basis by qualified personnel in accordance with local regulations. These records must be documented and maintained. They may be requested by ProSlide for any warranty claims.",
            source: "ProSlide MA-10059, Section 5.1.1",
          },
          {
            heading: "Langelier Saturation Index (LSI)",
            type: "text",
            body: "The LSI measures water's tendency to deposit or dissolve calcium carbonate. Negative LSI means corrosive water that attacks metal and FRP. Positive LSI means scaling water that deposits minerals on surfaces. Both extremes damage equipment and create safety issues. The target is a balanced LSI near zero.",
          },
          {
            heading: "Free Available Chlorine (FAC)",
            type: "text",
            body: "FAC is the active disinfectant in pool water. Too low = health risk. Too high = accelerated degradation of FRP gelcoat, rubber seals, and metal components. Maintaining FAC within manufacturer-specified limits protects both rider health and equipment integrity.",
          },
        ],
        keyTakeaways: [
          "Water quality directly affects slide materials, performance, and rider safety",
          "LSI measures scaling vs corrosion tendency — target near zero",
          "FAC outside limits degrades equipment and creates health or safety risks",
          "Monthly water quality records are mandatory and required for warranty claims",
        ],
      },
      {
        id: "6-2",
        title: "Operational Impacts of Poor Water Quality",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Poor water quality manifests as visible and measurable changes to the slide system. Operators who understand these signs can identify water quality issues through routine observation — before they cause incidents.",
          },
          {
            heading: "Scaling",
            type: "text",
            body: "High-LSI water deposits calcium and mineral scale on all wetted surfaces. On the flume, this creates the rough, white deposits that alter rider speed. On pumps and nozzles, it reduces flow capacity. On metal structures, it can mask corrosion developing underneath.",
          },
          {
            heading: "Corrosion",
            type: "text",
            body: "Low-LSI water is aggressive toward metals and can attack FRP gelcoat. Corrosion weakens structural steel, pump housings, and fasteners. The combination of chlorine and low-LSI water is particularly destructive.",
          },
          {
            heading: "Staining and Discolouration",
            type: "text",
            body: "Iron and manganese in the water cause rust-coloured or dark staining on FRP surfaces. While primarily cosmetic, heavy staining indicates water chemistry issues that are simultaneously damaging equipment in less visible ways.",
          },
        ],
        keyTakeaways: [
          "Scaling reduces rider safety and equipment efficiency",
          "Corrosive water attacks metals, FRP, and fasteners",
          "Visible staining indicates underlying water chemistry problems",
          "Operators should report changes in surface appearance as potential water quality indicators",
        ],
      },
      {
        id: "6-3",
        title: "What Operators Need to Monitor",
        duration: "8 min",
        content: [
          {
            type: "text",
            body: "Operators are not responsible for water chemistry management — but they are the most frequent observers of its effects. Knowing what to look for and when to escalate is a critical operational skill.",
          },
          {
            heading: "Visual Indicators to Report",
            type: "checklist",
            body: "Report any of these observations to maintenance:",
            items: [
              "White scale or haze appearing on flume surfaces between regular cleaning cycles",
              "Rust-coloured or dark staining on FRP or metal components",
              "Slimy or unusually slippery surfaces (potential algae or biofilm)",
              "Cloudy or discoloured water in the catch pool",
              "Unusual corrosion or degradation of metal components",
              "Reduced nozzle performance or spray patterns (possible mineral blockage)",
              "Riders reporting skin or eye irritation more frequently than normal",
            ],
          },
          {
            type: "oem-reference",
            body: "Water quality measurements are also required after any pool shock treatments to confirm the water quality levels are within the correct limits before returning the ride to operation.",
            source: "ProSlide MA-10059, Section 5.1.1",
          },
        ],
        keyTakeaways: [
          "Operators are the first to see water quality effects — observation is a key skill",
          "Seven visual indicators should trigger a report to maintenance",
          "After pool shock treatments, water quality must be confirmed before reopening",
          "Escalation is the correct response — operators report, specialists treat",
        ],
      },
    ],
  },
  {
    id: "incident-prevention",
    number: 7,
    title: "Incident Prevention",
    subtitle: "Stop It Before It Happens",
    description:
      "Scenario-based training built from real incident patterns. Learn to recognise early warning signs and intervene before situations escalate.",
    icon: "shield",
    color: "#e11d48",
    lessons: [
      {
        id: "7-1",
        title: "Collision Scenario — Late Dispatch",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "This is the most common waterslide incident pattern. Understanding the chain of events that leads to collision allows you to break the chain at multiple points.",
          },
          {
            heading: "The Scenario",
            type: "text",
            body: "A child (light weight, slow rider) is dispatched. Standard 15-second interval is applied. An adult (heavier, faster rider) is dispatched next. The child hits a section with minor mineral buildup and decelerates. The adult, traveling faster, closes the gap. Impact occurs in the mid-section of an enclosed flume where neither operator has visibility.",
          },
          {
            heading: "What Went Wrong",
            type: "checklist",
            body: "Multiple failures contributed:",
            items: [
              "Dispatch interval was not adjusted for the weight difference between riders",
              "Surface condition (mineral buildup) was not factored into timing",
              "Standard interval was applied rather than risk-based assessment",
              "Enclosed slide configuration meant mid-ride visibility was zero",
            ],
          },
          {
            heading: "How to Prevent This",
            type: "checklist",
            body: "Break the chain at any of these points:",
            items: [
              "Increase dispatch interval when a light rider is followed by a heavy rider",
              "Factor surface condition into every dispatch decision",
              "Never rely on fixed intervals alone — assess real-time conditions",
              "When visibility is limited, default to longer intervals",
              "Report surface condition changes that affect rider speed",
            ],
          },
        ],
        keyTakeaways: [
          "Collision from rider speed differential is the most common slide incident",
          "Multiple factors combine: weight difference + surface condition + fixed timing",
          "The chain can be broken at multiple points through active risk assessment",
          "Enclosed slides require more conservative timing due to zero mid-ride visibility",
        ],
      },
      {
        id: "7-2",
        title: "Non-Compliant Rider Scenario",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Non-compliant riders are an escalation management challenge. The operator must balance guest experience with absolute safety requirements — and safety always wins.",
          },
          {
            heading: "The Scenario",
            type: "text",
            body: "A group of teenagers are queuing. The first rider positions himself head-first despite clear instruction. When corrected, he complies but his friends begin laughing and one attempts to go standing. Queue pressure is building. Other guests are becoming impatient.",
          },
          {
            heading: "Decision Points",
            type: "checklist",
            body: "The operator's decision framework:",
            items: [
              "First non-compliance — clear, firm instruction with reason: 'You must go feet-first. This prevents head and spinal injuries.'",
              "Compliance after instruction — proceed with dispatch, remain alert for the group",
              "Second non-compliance (different rider, same group) — halt dispatch for the group. Explain the ride will not operate until all members comply.",
              "Continued non-compliance — remove the group from the ride. Contact supervisor if confrontation escalates.",
              "Aggressive or threatening behaviour — activate security protocols. Do not engage in argument.",
            ],
          },
          {
            type: "warning",
            body: "Queue pressure is real but irrelevant to safety decisions. Other guests waiting in line are safer with a delayed dispatch than with a non-compliant rider in the system.",
          },
        ],
        keyTakeaways: [
          "Escalation follows clear steps: instruct, halt, remove, escalate",
          "Queue pressure is never a valid reason to compromise on rider compliance",
          "Reasons strengthen instructions — explain the 'why' behind the rule",
          "Aggressive behaviour = security protocols, not operator confrontation",
        ],
      },
      {
        id: "7-3",
        title: "Blockage in Slide Scenario",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "A rider stoppage inside the flume is one of the highest-risk scenarios because subsequent riders cannot see the obstruction and the stopped rider is in a confined, vulnerable position.",
          },
          {
            heading: "The Scenario",
            type: "text",
            body: "An exit operator notices that a dispatched rider has not arrived within the expected timeframe. Communication with the top operator confirms a second rider was dispatched 15 seconds after the first. The slide is an enclosed flume.",
          },
          {
            heading: "Immediate Response",
            type: "checklist",
            body: "Emergency protocol:",
            items: [
              "STOP all dispatch immediately — signal the top operator",
              "Do NOT send anyone into the slide to check",
              "Attempt verbal communication at entry and exit points",
              "If the slide has viewing windows or access panels, use them",
              "If the rider does not emerge within the emergency timeframe, activate rescue protocol",
              "The second rider may have already impacted — treat as a potential injury event",
            ],
          },
          {
            type: "critical",
            body: "The instinct to 'send someone in to help' is extremely dangerous. A rescue rider entering a blocked slide creates a second impact. Rescue must be performed through access panels or by trained personnel following the site emergency plan.",
          },
        ],
        keyTakeaways: [
          "Stop all dispatch immediately when a blockage is suspected",
          "Never send another rider in to 'check' — this causes secondary impacts",
          "Non-arrival within expected timeframe is a blockage indicator",
          "Rescue through access panels by trained personnel only",
        ],
      },
      {
        id: "7-4",
        title: "High Throughput Pressure Scenario",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Peak operational periods generate the strongest pressure to compromise safety controls. This scenario trains you to recognise pressure indicators and maintain safe operations under load.",
          },
          {
            heading: "The Scenario",
            type: "text",
            body: "It's the hottest day of the season. Queue times are exceeding 45 minutes. Guests are visibly frustrated and some are being verbally aggressive. A supervisor radios to ask if dispatch intervals can be reduced. The surface hasn't been waxed in 4 months due to scheduling conflicts.",
          },
          {
            heading: "Pressure vs Safety Analysis",
            type: "checklist",
            body: "Real-time decision framework:",
            items: [
              "Queue length and guest frustration are management problems — not safety compromises",
              "Surface condition (4 months without waxing) means intervals should be INCREASED, not decreased",
              "Supervisor requests to reduce intervals should be responded to with the current risk assessment",
              "If fatigue or distraction is affecting your performance, request rotation — don't push through",
              "Document any pressure to compromise safety controls",
            ],
          },
          {
            type: "warning",
            body: "The highest-risk period for waterslide incidents is peak attendance on hot days — the exact time when pressure to reduce intervals is strongest. This is not coincidence. Maintaining controls under this pressure is the single most important operational skill.",
          },
        ],
        keyTakeaways: [
          "Peak attendance = highest incident risk = strongest pressure to compromise",
          "Surface condition may require increased intervals regardless of queue pressure",
          "Requests to reduce intervals should be met with risk assessment, not compliance",
          "Document all pressure to compromise safety controls",
        ],
        quiz: [
          {
            id: "q7-4-1",
            question:
              "A supervisor asks you to reduce dispatch intervals because queue times are over 40 minutes. The flume surface hasn't been waxed in 4 months. What is the correct response?",
            options: [
              "Reduce intervals by 5 seconds as a compromise",
              "Comply with the supervisor's instruction — they outrank you",
              "Explain the surface condition and recommend maintaining or increasing intervals, then document the exchange",
              "Ignore the supervisor and continue as normal without responding",
            ],
            correctIndex: 2,
            explanation:
              "The correct response is to communicate the risk assessment (poor surface condition requires maintaining or increasing intervals) and document the exchange. Safety controls are not subject to hierarchy override.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "response-shutdown",
    number: 8,
    title: "Response and Shutdown",
    subtitle: "When Things Go Wrong",
    description:
      "Emergency response protocols, communication chains, post-incident procedures. How to respond fast, correctly, and defensibly.",
    icon: "siren",
    color: "#b91c1c",
    lessons: [
      {
        id: "8-1",
        title: "Stop Protocols",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Stop protocols are the emergency brake of slide operations. They must be executed without hesitation and without requiring approval. The time between recognising a problem and stopping dispatch is the critical safety window.",
          },
          {
            heading: "Immediate Shutdown Triggers",
            type: "checklist",
            body: "Any of these conditions require immediate dispatch cessation:",
            items: [
              "Rider does not exit within expected timeframe — potential blockage",
              "Rider exits with visible injury",
              "Structural failure observed — crack, separation, collapse",
              "Water flow interruption — pump failure, nozzle blockage",
              "Communication system failure between operators",
              "Uncontrolled entry — someone enters the flume without being dispatched",
              "Weather event — lightning, severe wind, sudden heavy rain reducing visibility",
              "Any gut feeling that something is wrong — do not override instinct with rationalisation",
            ],
          },
          {
            type: "critical",
            body: "You do not need permission to stop dispatch. You do not need to confirm with a supervisor first. If you see a trigger condition, you stop. Every second of delay is a second during which a rider may be dispatched into a dangerous system.",
          },
        ],
        keyTakeaways: [
          "Stop protocols require no permission and no delay",
          "Eight specific trigger conditions require immediate shutdown",
          "Instinct is a valid trigger — do not rationalise away a safety concern",
          "Every second of delay is a second a rider could be dispatched into danger",
        ],
      },
      {
        id: "8-2",
        title: "Communication and Escalation",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "After stopping dispatch, the communication chain determines how quickly the situation is managed and how effectively the response is coordinated.",
          },
          {
            heading: "Escalation Hierarchy",
            type: "checklist",
            body: "Contact in this order based on severity:",
            items: [
              "Partner operator (top/bottom) — immediate coordination",
              "Supervisor on duty — incident management and resource allocation",
              "First aid / lifeguard team — if injury is suspected or confirmed",
              "Emergency services (000 / site emergency number) — for serious injury, entrapment, or structural failure",
              "Facility management — for non-immediate issues requiring maintenance response",
              "Manufacturer support — for equipment failures requiring OEM guidance",
            ],
          },
          {
            heading: "Communication Protocol",
            type: "text",
            body: "Use structured communication: State your name, location, and the situation clearly. 'This is [name] at [slide name] top station. I have stopped dispatch because [reason]. The last rider dispatched at [time]. I need [specific response required].' Clear, structured messages prevent confusion and ensure the correct response is mobilised.",
          },
        ],
        keyTakeaways: [
          "Escalation follows a specific hierarchy based on severity",
          "Structured communication: name, location, situation, need",
          "Clear messages prevent confusion and mobilise correct response",
          "Manufacturer support is available for equipment failures",
        ],
      },
      {
        id: "8-3",
        title: "Post-Incident Controls",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "What happens after an incident is as important as the response itself. Correct post-incident procedures protect the injured, preserve evidence, support investigation, and reduce your organisation's legal exposure.",
          },
          {
            heading: "Scene Integrity",
            type: "text",
            body: "Do not move equipment, clean surfaces, or alter the scene unless necessary for medical treatment. The scene as it exists at the time of the incident is evidence. Photographs should be taken as soon as practical. If the slide was operating, note the flow rate, dispatch times, and any equipment readings.",
          },
          {
            heading: "Documentation Requirements",
            type: "checklist",
            body: "Record immediately, while memory is fresh:",
            items: [
              "Exact time of the incident",
              "Exact location on the slide (section number if possible)",
              "Who was involved (rider, operator, witness)",
              "What happened — factual description, not interpretation",
              "What conditions were present (flow rate, surface condition, weather, queue state)",
              "What actions were taken in response",
              "Names and contact details of witnesses",
              "Photographs of the scene, any damage, and relevant conditions",
            ],
          },
          {
            heading: "Emotional and Psychological Considerations",
            type: "text",
            body: "Operators involved in incidents experience stress, guilt, and anxiety. These are normal responses. Post-incident debriefing should be conducted by a supervisor — not to assign blame, but to support the operator and capture learning. Access to employee assistance programs should be offered where available.",
          },
          {
            type: "warning",
            body: "Never speculate on cause or blame in your documentation. Record facts only. 'The rider exited the catch pool with a visible laceration to the left forearm' — not 'The rider was injured because they were riding incorrectly.'",
          },
        ],
        keyTakeaways: [
          "Scene integrity is evidence — do not alter unless required for medical treatment",
          "Document immediately with facts, not interpretations or blame",
          "Eight specific data points must be recorded",
          "Operator welfare after incidents is a management responsibility",
        ],
      },
    ],
  },
  {
    id: "assessment",
    number: 9,
    title: "Assessment and Certification",
    subtitle: "Prove Your Competency",
    description:
      "Comprehensive assessment covering knowledge, defect identification, and scenario-based decision making. Complete this to earn your certification.",
    icon: "certificate",
    color: "#059669",
    lessons: [
      {
        id: "9-1",
        title: "Knowledge Assessment",
        duration: "20 min",
        content: [
          {
            type: "text",
            body: "This assessment tests your understanding of standards, OEM requirements, inspection procedures, and operational controls. You need 80% or higher to pass. Review any module you're unsure about before attempting.",
          },
        ],
        keyTakeaways: [
          "80% pass mark required",
          "Covers all 8 training modules",
          "Review modules before attempting if unsure",
        ],
        quiz: [
          {
            id: "q9-1",
            question:
              "What standard does Waterplay reference for slide maintenance requirements?",
            options: [
              "ISO 31000",
              "ASTM F1193",
              "EN 1069",
              "AS 3533",
            ],
            correctIndex: 1,
            explanation:
              "The Waterplay FRP Maintenance and Repair manual references ASTM F1193 standards for water slide maintenance requirements.",
            type: "knowledge",
          },
          {
            id: "q9-2",
            question:
              "What water quality measurements must be recorded monthly according to ProSlide?",
            options: [
              "pH and temperature only",
              "LSI and FAC levels",
              "Turbidity and colour",
              "Chlorine and bromine",
            ],
            correctIndex: 1,
            explanation:
              "ProSlide requires LSI (Langelier Saturation Index) and FAC (Free Available Chlorine) levels to be recorded monthly by qualified personnel.",
            type: "knowledge",
          },
          {
            id: "q9-3",
            question:
              "What type of sealant should be used to fill joints between flume sections?",
            options: [
              "Rigid epoxy for maximum strength",
              "Silicone bathroom sealant",
              "Flexible polyurethane adhesive sealant (e.g. Sikaflex 1a)",
              "Hot glue for quick repairs",
            ],
            correctIndex: 2,
            explanation:
              "Joints must use flexible polyurethane adhesive sealant to accommodate thermal expansion and contraction. Rigid fillers will crack and create dangerous edges.",
            type: "knowledge",
          },
          {
            id: "q9-4",
            question:
              "How often does Waterplay recommend buffing and waxing the slide surface?",
            options: [
              "Once per year during shutdown",
              "Every 2-3 months",
              "Weekly",
              "Only when visible damage appears",
            ],
            correctIndex: 1,
            explanation:
              "Waterplay recommends buffing and waxing every 2-3 months. This is a safety requirement, not just cosmetic — waxed surfaces prevent calcium buildup that causes riders to stick.",
            type: "knowledge",
          },
          {
            id: "q9-5",
            question:
              "During peak attendance, a supervisor asks you to dispatch riders faster. The surface was last waxed 5 months ago and you've noticed riders seem slower today. What do you do?",
            options: [
              "Follow the supervisor's instruction",
              "Refuse and walk off the position",
              "Communicate the surface condition risk, maintain or increase intervals, and document the exchange",
              "Reduce intervals slightly as a compromise",
            ],
            correctIndex: 2,
            explanation:
              "Safety controls are not subject to hierarchy override. Communicate the risk assessment, maintain safe intervals, and document any pressure to compromise controls.",
            type: "scenario",
          },
          {
            id: "q9-6",
            question:
              "A rider stops mid-slide in an enclosed flume. The next rider was dispatched 12 seconds ago. What is your immediate action?",
            options: [
              "Send the next rider to push them along",
              "Stop all dispatch immediately and activate emergency protocol",
              "Wait to see if they start moving again",
              "Increase water flow to flush them out",
            ],
            correctIndex: 1,
            explanation:
              "A blockage in an enclosed slide with a rider already dispatched is a potential collision scenario. Immediate dispatch cessation and emergency protocol activation is required.",
            type: "scenario",
          },
          {
            id: "q9-7",
            question:
              "You find a puncture hole in the flume surface during your morning inspection. The park opens in 20 minutes. What is the correct action?",
            options: [
              "Cover it with waterproof tape and monitor it",
              "The slide does not open — punctures must be repaired immediately to maintain slide integrity",
              "Open the slide but avoid dispatching riders over that section",
              "Fill it with silicone sealant for a temporary fix",
            ],
            correctIndex: 1,
            explanation:
              "Per the Waterplay manual, punctures must be repaired immediately to maintain the integrity of the slide. The slide should not operate with a punctured surface.",
            type: "defect",
          },
          {
            id: "q9-8",
            question:
              "What four inspection tiers does ProSlide define?",
            options: [
              "Quick, Standard, Detailed, Emergency",
              "Routine, Periodic, Thorough, Structural",
              "Daily, Weekly, Monthly, Annual",
              "Visual, Physical, Chemical, Structural",
            ],
            correctIndex: 1,
            explanation:
              "ProSlide defines Routine (daily), Periodic (monthly/quarterly/yearly), Thorough (by competent professional), and Structural (when damage is suspected) inspection tiers.",
            type: "knowledge",
          },
          {
            id: "q9-9",
            question:
              "Why should fiberglass never be applied over flume joints?",
            options: [
              "It's too expensive",
              "It voids the manufacturer warranty",
              "Glassed-over joints that crack leave jagged edges that can injure riders",
              "It blocks water drainage",
            ],
            correctIndex: 2,
            explanation:
              "Per the Waterplay manual, fiberglass must not be put over joints because glassed-over joints that crack may leave jagged edges that can injure riders.",
            type: "knowledge",
          },
          {
            id: "q9-10",
            question:
              "After an incident, an upset parent demands to know what went wrong. What is the correct response?",
            options: [
              "Explain what you think happened to calm them down",
              "Apologise and accept responsibility to de-escalate",
              "Provide factual, limited information and direct them to facility management — do not speculate on cause",
              "Ignore them and focus on the scene",
            ],
            correctIndex: 2,
            explanation:
              "Post-incident communication should be factual and limited. Speculation on cause or acceptance of responsibility has legal implications. Direct the person to facility management who are trained in incident communication.",
            type: "scenario",
          },
        ],
      },
    ],
  },
];

export function getTotalLessons(): number {
  return modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
}

export function getTotalQuizQuestions(): number {
  return modules.reduce(
    (acc, mod) =>
      acc +
      mod.lessons.reduce(
        (lacc, lesson) => lacc + (lesson.quiz?.length || 0),
        0
      ),
    0
  );
}
