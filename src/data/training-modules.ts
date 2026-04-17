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
  quiz: QuizQuestion[];
}

export interface LessonSection {
  heading?: string;
  body: string;
  type: "text" | "warning" | "critical" | "checklist" | "oem-reference" | "diagram" | "case-study";
  items?: string[];
  source?: string;
  diagramId?: string;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  badge: { icon: string; label: string };
  lessons: Lesson[];
}

export const modules: Module[] = [
  {
    id: "standards-legislation",
    number: 1,
    title: "Standards and Legislation",
    subtitle: "The Rules That Keep Everyone Safe",
    description:
      "Understand the Australian regulatory framework, key standards and your legal obligations as a waterslide operator. This module establishes the foundation for everything that follows.",
    icon: "scales",
    color: "#4f46e5",
    badge: { icon: "scales", label: "Compliance Certified" },
    lessons: [
      {
        id: "1-sl-1",
        title: "Australian WHS Framework",
        duration: "12 min",
        content: [
          {
            type: "text",
            heading: "Work Health and Safety Act 2011",
            body: "The Work Health and Safety (WHS) Act 2011 is the primary legislation governing workplace safety across most Australian states and territories. It establishes the legal duties owed by all parties in a workplace - including aquatic recreation facilities. As a waterslide operator, you are working within this framework every time you step onto a platform.",
          },
          {
            type: "critical",
            body: "The WHS Act applies to ALL persons at a workplace - not just employees. This includes contractors, visitors and members of the public using your facility. Failure to meet WHS obligations can result in significant penalties including fines and imprisonment for serious breaches.",
          },
          {
            type: "text",
            heading: "PCBU Duties",
            body: "A Person Conducting a Business or Undertaking (PCBU) has the primary duty of care under the WHS Act. For waterslide operations, the facility owner or operator is typically the PCBU. Their duty is to ensure, so far as is reasonably practicable, the health and safety of workers and others who may be affected by the work. This includes providing safe plant and equipment, safe systems of work, adequate training and supervision and a safe working environment.",
          },
          {
            type: "text",
            heading: "Worker Duties",
            body: "As a worker under the WHS Act, you have a duty to take reasonable care for your own health and safety, take reasonable care that your acts or omissions do not adversely affect the health and safety of others and comply with any reasonable instruction given by the PCBU. You must also cooperate with any reasonable policy or procedure relating to health and safety.",
          },
          {
            type: "warning",
            body: "Workers have the right to cease or refuse to carry out work if they have a reasonable concern that it would expose them or others to a serious risk to health or safety. This right is protected under the WHS Act. If you identify an unsafe condition on a waterslide, you are within your rights to stop operations.",
          },
          {
            type: "text",
            heading: "Officers and Due Diligence",
            body: "Officers of a PCBU (directors, senior managers) have a positive duty to exercise due diligence to ensure the PCBU complies with its WHS obligations. This means they must acquire and keep up-to-date knowledge of WHS matters, understand the operations and associated hazards, ensure appropriate resources and processes are in place and verify that obligations are being met.",
          },
        ],
        keyTakeaways: [
          "The WHS Act 2011 is the primary safety legislation in Australia",
          "PCBUs have the primary duty of care for all persons at the workplace",
          "Workers must take reasonable care and follow safety procedures",
          "Workers have the right to cease unsafe work",
          "Officers must exercise due diligence in WHS compliance",
        ],
        quiz: [
          {
            id: "q-sl-1-1",
            question: "Under the WHS Act 2011, who holds the primary duty of care?",
            options: [
              "The individual worker on shift",
              "The Person Conducting a Business or Undertaking (PCBU)",
              "The local council or government body",
              "The equipment manufacturer",
            ],
            correctIndex: 1,
            explanation: "The PCBU holds the primary duty of care under the WHS Act 2011. They must ensure, so far as is reasonably practicable, the health and safety of workers and others affected by the work.",
            type: "knowledge",
          },
          {
            id: "q-sl-1-2",
            question: "You notice a structural crack on a slide support column during operations. Your supervisor says to keep dispatching while they investigate. What is your legal right?",
            options: [
              "You must follow your supervisor's instruction",
              "You can cease work if you have a reasonable concern about serious risk",
              "You must continue operating but file a formal complaint",
              "You can only stop if another worker agrees with you",
            ],
            correctIndex: 1,
            explanation: "Under the WHS Act, workers have the right to cease or refuse work if they have a reasonable concern that it would expose them or others to a serious risk to health or safety. A structural crack on a support column represents a serious risk.",
            type: "scenario",
          },
          {
            id: "q-sl-1-3",
            question: "Which of the following is NOT a worker duty under the WHS Act?",
            options: [
              "Take reasonable care for your own health and safety",
              "Comply with reasonable safety instructions",
              "Personally inspect all structural components before each shift",
              "Cooperate with reasonable safety policies and procedures",
            ],
            correctIndex: 2,
            explanation: "Structural inspections are the responsibility of competent professionals, not individual operators. Worker duties focus on reasonable care, compliance with instructions and cooperation with safety policies.",
            type: "knowledge",
          },
          {
            id: "q-sl-1-4",
            question: "The WHS Act applies to which persons at a waterslide facility?",
            options: [
              "Only paid employees of the facility",
              "Employees and contractors only",
              "All persons at the workplace including workers, contractors, visitors and members of the public",
              "Only those who have signed a liability waiver",
            ],
            correctIndex: 2,
            explanation: "The WHS Act applies to all persons at a workplace. The PCBU owes a duty of care to workers, contractors, visitors and members of the public who may be affected by the work carried out.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "1-sl-2",
        title: "Key Australian Standards",
        duration: "15 min",
        content: [
          {
            type: "text",
            heading: "AS 3533 - Amusement Rides and Devices",
            body: "AS 3533 is the primary Australian standard governing amusement rides and devices, including waterslides. It covers design, manufacture, installation, operation, maintenance and inspection requirements. Compliance with AS 3533 is typically a legal requirement under state and territory amusement device regulations. The standard is divided into multiple parts covering different aspects of amusement device safety.",
          },
          {
            type: "oem-reference",
            body: "AS 3533.1 covers design and construction requirements. AS 3533.2 covers operation and maintenance. AS 3533.3 covers in-service inspection. AS 3533.4 covers major inspections and testing. Together, these parts establish a comprehensive safety framework for the entire lifecycle of amusement devices including waterslides.",
            source: "AS 3533 Parts 1-4",
          },
          {
            type: "text",
            heading: "EN 1069 - Water Slides",
            body: "EN 1069 is the European standard specifically for water slides. While it is a European standard, it is widely referenced internationally and provides detailed technical guidance on water slide design, construction and operation. Many Australian facilities and manufacturers reference EN 1069 alongside AS 3533 for waterslide-specific requirements that go beyond general amusement device standards.",
          },
          {
            type: "text",
            heading: "ASTM F1193 - Amusement Rides and Devices",
            body: "ASTM F1193 is an American standard covering the quality, design, manufacture and operation of amusement rides. It is particularly relevant for FRP (fiberglass reinforced plastic) maintenance and repair guidance. Many waterslide manufacturers reference ASTM F1193 in their maintenance documentation. Australian facilities often use ASTM F1193 alongside AS 3533 for technical guidance on fiberglass slide maintenance.",
          },
          {
            type: "text",
            heading: "AS/NZS ISO 31000 - Risk Management",
            body: "AS/NZS ISO 31000 provides principles and guidelines for risk management. Under the WHS Act, PCBUs must manage risks to health and safety by following a systematic process: identify hazards, assess risks, implement controls and review effectiveness. ISO 31000 provides the framework for this process. Risk assessments for waterslide operations should follow this standard.",
          },
          {
            type: "warning",
            body: "Standards are updated periodically. It is the responsibility of the PCBU to ensure they are working to the current version of all applicable standards. Using an outdated standard does not provide a defence under the WHS Act.",
          },
          {
            type: "text",
            heading: "AS 1926 - Swimming Pool Safety",
            body: "AS 1926 covers safety requirements for swimming pools, which intersects with waterslide operations at catch pools and landing areas. Requirements around fencing, water depth, supervision and signage may apply to waterslide catch pools depending on state and territory regulations.",
          },
        ],
        keyTakeaways: [
          "AS 3533 is the primary Australian standard for amusement devices including waterslides",
          "EN 1069 provides waterslide-specific technical guidance",
          "ASTM F1193 is key for FRP/fiberglass maintenance and repair",
          "AS/NZS ISO 31000 provides the risk management framework required under WHS law",
          "Standards are updated regularly - always work to the current version",
        ],
        quiz: [
          {
            id: "q-sl-2-1",
            question: "Which Australian standard is the primary standard governing amusement rides and devices including waterslides?",
            options: [
              "EN 1069",
              "ASTM F1193",
              "AS 3533",
              "ISO 31000",
            ],
            correctIndex: 2,
            explanation: "AS 3533 is the primary Australian standard for amusement rides and devices. It covers design, manufacture, installation, operation, maintenance and inspection requirements for all amusement devices including waterslides.",
            type: "knowledge",
          },
          {
            id: "q-sl-2-2",
            question: "What is ASTM F1193 particularly relevant for in waterslide maintenance?",
            options: [
              "Water quality testing procedures",
              "FRP (fiberglass reinforced plastic) maintenance and repair guidance",
              "Rider height and weight restrictions",
              "Emergency evacuation procedures",
            ],
            correctIndex: 1,
            explanation: "ASTM F1193 is widely referenced for its detailed guidance on FRP (fiberglass reinforced plastic) maintenance and repair, which is directly relevant to waterslide flume maintenance.",
            type: "knowledge",
          },
          {
            id: "q-sl-2-3",
            question: "Your facility manager tells you they are following the 2008 version of AS 3533 because it was current when the slide was installed. Is this acceptable?",
            options: [
              "Yes - the standard at the time of installation applies for the life of the equipment",
              "No - the PCBU must always work to the current version of applicable standards",
              "Yes - as long as the manufacturer has not issued updates",
              "Only if the state regulator has not mandated an upgrade",
            ],
            correctIndex: 1,
            explanation: "Standards are updated periodically and it is the PCBU's responsibility to work to the current version. Using an outdated standard does not provide a defence under the WHS Act.",
            type: "scenario",
          },
          {
            id: "q-sl-2-4",
            question: "Which standard provides the framework for conducting risk assessments required under Australian WHS law?",
            options: [
              "AS 3533",
              "EN 1069",
              "AS/NZS ISO 31000",
              "ASTM F1193",
            ],
            correctIndex: 2,
            explanation: "AS/NZS ISO 31000 provides the principles and guidelines for risk management. The WHS Act requires PCBUs to manage risks systematically, and ISO 31000 provides the accepted framework for doing so.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "1-sl-3",
        title: "Plant Registration and Compliance",
        duration: "12 min",
        content: [
          {
            type: "text",
            heading: "Waterslides as Registered Plant",
            body: "Under WHS Regulations, waterslides are classified as 'plant' and in most states and territories must be registered with the relevant regulator before they can be operated. Plant registration ensures that the design has been verified, the installation has been inspected and the equipment meets applicable standards. Operating an unregistered amusement device is a serious offence.",
          },
          {
            type: "critical",
            body: "Each state and territory has its own regulator and may have specific requirements for amusement device registration. Examples include SafeWork NSW, WorkSafe Victoria, Workplace Health and Safety Queensland and WorkSafe WA. Operators must be familiar with the requirements of their specific jurisdiction.",
          },
          {
            type: "text",
            heading: "Design Registration vs Item Registration",
            body: "Most jurisdictions require two levels of registration. Design registration confirms the ride design meets applicable standards. Item registration confirms that a specific installation of that design has been correctly built, installed and inspected. Both must be current for a waterslide to operate legally.",
          },
          {
            type: "text",
            heading: "Competent Persons",
            body: "WHS Regulations and AS 3533 require that certain inspection and maintenance tasks be carried out by a 'competent person' - someone who has the knowledge, training, qualifications and experience to carry out the task safely and effectively. As a waterslide operator, you are being trained to be competent in routine operational checks. Thorough inspections and structural assessments require higher-level competency, typically held by engineers or specialist inspectors.",
          },
          {
            type: "checklist",
            heading: "What Operators Should Know About Compliance",
            body: "While compliance management is typically the responsibility of facility management, operators should be aware of the following:",
            items: [
              "The waterslide must have current plant registration in your state or territory",
              "Inspection records must be maintained and available for regulatory audit",
              "Any modifications to the ride must be assessed and may require re-registration",
              "Incident notification obligations exist for serious injuries and dangerous occurrences",
              "Routine inspection documentation is a legal requirement, not just best practice",
            ],
          },
          {
            type: "text",
            heading: "Notifiable Incidents",
            body: "Under the WHS Act, certain incidents must be reported to the regulator. These include death, serious injury or illness and dangerous incidents (near misses that could have caused serious harm). The PCBU must notify the regulator immediately and preserve the incident site. As an operator, you play a critical role in the initial response and documentation that supports this notification process.",
          },
          {
            type: "warning",
            body: "Incident notification to the regulator is a legal obligation, not a discretionary decision. Failure to notify a notifiable incident can result in significant penalties. If in doubt about whether an incident is notifiable, report it - it is better to over-report than to miss a notification obligation.",
          },
        ],
        keyTakeaways: [
          "Waterslides must be registered as plant under WHS Regulations",
          "Both design registration and item registration are typically required",
          "Certain tasks require a competent person with appropriate qualifications",
          "Notifiable incidents must be reported to the regulator immediately",
          "Inspection documentation is a legal requirement",
        ],
        quiz: [
          {
            id: "q-sl-3-1",
            question: "Under WHS Regulations, waterslides are classified as what?",
            options: [
              "Recreational equipment",
              "Building infrastructure",
              "Registered plant",
              "Temporary structures",
            ],
            correctIndex: 2,
            explanation: "Waterslides are classified as 'plant' under WHS Regulations and must be registered with the relevant state or territory regulator before operation.",
            type: "knowledge",
          },
          {
            id: "q-sl-3-2",
            question: "A rider breaks their arm on a waterslide at your facility. What is the PCBU's obligation regarding this incident?",
            options: [
              "Record it in the incident log and review at the next safety meeting",
              "Notify the regulator immediately and preserve the incident site",
              "Notify the regulator within 30 days if the rider makes a formal complaint",
              "Only notify if the rider requires overnight hospitalisation",
            ],
            correctIndex: 1,
            explanation: "A serious injury is a notifiable incident under the WHS Act. The PCBU must notify the regulator immediately and preserve the incident site. A broken bone constitutes a serious injury.",
            type: "scenario",
          },
          {
            id: "q-sl-3-3",
            question: "What does 'competent person' mean in the context of waterslide inspections?",
            options: [
              "Any employee who has worked at the facility for more than 12 months",
              "Someone with the knowledge, training, qualifications and experience to carry out the task safely",
              "A person appointed by the facility manager regardless of qualifications",
              "Only a licensed structural engineer",
            ],
            correctIndex: 1,
            explanation: "A competent person has the knowledge, training, qualifications and experience to carry out the specific task safely and effectively. The level of competency required varies with the complexity and risk of the task.",
            type: "knowledge",
          },
          {
            id: "q-sl-3-4",
            question: "A maintenance team modifies the landing pool depth on a waterslide to improve rider experience. What compliance step is required?",
            options: [
              "No action needed if the change improves safety",
              "Update the operations manual only",
              "The modification must be assessed against standards and may require re-registration",
              "File a notice with the manufacturer within 90 days",
            ],
            correctIndex: 2,
            explanation: "Any modification to a registered amusement device must be assessed against applicable standards and may require the design and/or item registration to be updated. Unapproved modifications can void registration.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "system-understanding",
    number: 2,
    title: "System Understanding",
    subtitle: "What You're Actually Operating",
    description:
      "Understand the waterslide as an engineered system - flume, joints, supports and hydraulics - and the responsibilities that come with operating it.",
    icon: "blueprint",
    color: "#0891b2",
    badge: { icon: "blueprint", label: "System Expert" },
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
            type: "diagram",
            heading: "System Overview",
            body: "The major components of a waterslide system and how they connect.",
            diagramId: "slide-cross-section",
          },
          {
            type: "checklist",
            body: "Core system components:",
            items: [
              "Flume - The fiberglass reinforced plastic (FRP) channel riders travel through. Subject to UV degradation, mineral deposits, friction wear and structural cracking.",
              "Joints - Connections between flume sections. Filled with flexible sealant to accommodate thermal expansion and contraction.",
              "Support Structure - Steel or concrete framework holding the flume at correct angles and elevations. Subject to corrosion and fatigue.",
              "Hydraulic System - Pumps, pipes, nozzles and flow control that deliver water to the flume. Correct flow rate must be achieved before any rider enters.",
              "Catch Pool / Runout - The deceleration and exit zone at the base. Must be clear before dispatch.",
              "Tower / Platform - The elevated start position where riders are dispatched. Includes handrails, barriers and communication systems.",
            ],
          },
          {
            type: "oem-reference",
            body: "A water ride must be treated as an integrated system where all components require coordinated maintenance. Neglecting any individual element can compromise the safety of the entire ride.",
          },
          {
            heading: "Why This Matters",
            type: "text",
            body: "Most incidents don't originate from catastrophic failure. They come from degradation of one component interacting with operational pressure. A slight mineral buildup on the flume surface changes rider speed. A worn joint creates a lip that catches riders. A blocked nozzle creates a dry spot. Understanding the system means understanding how small changes cascade into safety events.",
          },
        ],
        keyTakeaways: [
          "A waterslide is an engineered system, not a simple piece of equipment",
          "Six core components must all function together: flume, joints, supports, hydraulics, catch pool and tower",
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
              "Joints filled with flexible sealant",
              "The catch pool",
              "Handrails",
            ],
            correctIndex: 1,
            explanation:
              "Joints between flume sections are filled with flexible sealant to accommodate expansion and contraction from temperature changes.",
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
              "Per manufacturer requirements, the correct flow rate and water levels must be achieved and maintained prior to allowing anyone to enter the start position.",
            type: "knowledge",
          },
          {
            id: "q1-1-3",
            question:
              "A blocked nozzle in the hydraulic system is identified during a pre-opening check. Why does this matter beyond reduced water coverage?",
            options: [
              "It only affects the visual appearance of the water flow",
              "It creates a dry spot where riders decelerate unpredictably, increasing collision risk",
              "It increases water pressure elsewhere, which improves performance",
              "It has no safety impact if most other nozzles are working",
            ],
            correctIndex: 1,
            explanation:
              "The hydraulic system is a core component of the waterslide system. A blocked nozzle creates a dry spot - a zone where riders lose the water lubrication they depend on. This causes unexpected deceleration, making dispatch timing unreliable and creating collision risk.",
            type: "scenario",
          },
          {
            id: "q1-1-4",
            question:
              "What material is the flume (the channel riders travel through) primarily made from?",
            options: [
              "Reinforced concrete",
              "High-density polyethylene (HDPE)",
              "Fiberglass reinforced plastic (FRP)",
              "Stainless steel",
            ],
            correctIndex: 2,
            explanation:
              "The flume is made from fiberglass reinforced plastic (FRP). This material is subject to UV degradation, mineral deposits, friction wear and structural cracking - all of which require monitoring.",
            type: "knowledge",
          },
          {
            id: "q1-1-5",
            question:
              "Which statement best describes how most waterslide incidents originate?",
            options: [
              "Catastrophic structural failure of the flume",
              "Rider negligence alone, with no equipment contribution",
              "Degradation of one component interacting with operational pressure",
              "Manufacturing defects present from installation",
            ],
            correctIndex: 2,
            explanation:
              "Most incidents don't come from dramatic failures. They develop from the degradation of one component - a rough surface, a worn joint, a blocked nozzle - intersecting with operational pressure such as dispatch timing or queue management.",
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
            body: "Clear role definition prevents critical tasks from falling through the gaps. Industry standards explicitly define three tiers of responsibility - and your training must comply with all of them.",
          },
          {
            heading: "Owner / Operator",
            type: "text",
            body: "The Owner/Operator is responsible to operate and maintain the water ride in accordance with their Standard Operating Procedures (SOP) to ensure consistent and safe ride performance. This includes ensuring the staff that operate and maintain the ride are trained and are fulfilling their responsibilities.",
          },
          {
            type: "critical",
            body: "WARNING: Failure to adhere to the inspection and maintenance recommendations of the ride may result in serious injury or death. Failure to follow and maintain documented records will void the manufacturer's warranty.",
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
            body: "Training should extend beyond inspection and maintenance tasks to cover hazard identification, working at heights procedures, PPE requirements and Safety Data Sheet (SDS) awareness.",
          },
        ],
        keyTakeaways: [
          "Three distinct roles: Owner/Operator, Maintenance Team, Operations Team",
          "Each role has specific, non-overlapping responsibilities",
          "Failure to maintain records voids manufacturer warranty",
          "Training requirements extend beyond basic operations to include hazard identification, PPE and more",
        ],
        quiz: [
          {
            id: "q1-2-1",
            question:
              "What is the consequence of failure to follow maintenance recommendations?",
            options: [
              "A fine from the manufacturer",
              "Reduced slide performance only",
              "Serious injury or death, plus voided warranty",
              "A warning letter",
            ],
            correctIndex: 2,
            explanation:
              "Failure to adhere to inspection and maintenance recommendations may result in serious injury or death, and failure to maintain records will void the warranty.",
            type: "knowledge",
          },
          {
            id: "q1-2-2",
            question:
              "Which team is responsible for rider dispatch control and timing?",
            options: [
              "Owner/Operator",
              "Maintenance Team",
              "Operations Team",
              "Any trained staff member regardless of role",
            ],
            correctIndex: 2,
            explanation:
              "Rider dispatch control and timing is an Operations Team responsibility. The three roles have specific, non-overlapping responsibilities - maintenance staff monitor water flows and perform inspections, while operations staff manage dispatch and rider behaviour.",
            type: "knowledge",
          },
          {
            id: "q1-2-3",
            question:
              "Training requirements for waterslide staff must include which of the following beyond basic operations?",
            options: [
              "Customer service and upselling techniques",
              "Hazard identification, working at heights, PPE requirements and Safety Data Sheet training",
              "Swimming proficiency and first aid certification only",
              "Social media policy and facility history",
            ],
            correctIndex: 1,
            explanation:
              "Training must not be limited to inspection and maintenance activities - it must also include hazard identification, working at heights procedures, PPE requirements and Safety Data Sheet (SDS) training.",
            type: "knowledge",
          },
          {
            id: "q1-2-4",
            question:
              "A maintenance team member notices that water flow has dropped below the manufacturer's specified rate while the facility is open. Whose responsibility is it to address this?",
            options: [
              "Only the Owner/Operator can authorise any action",
              "The maintenance team - they are responsible for monitoring water flows and levels continuously throughout operations",
              "The operations team - they should increase dispatch intervals and continue",
              "No one needs to act unless riders are complaining",
            ],
            correctIndex: 1,
            explanation:
              "Monitoring water flows and water levels continuously throughout operations is a maintenance team responsibility. Correct water flow is a critical safety control and must be maintained at all times during operation.",
            type: "scenario",
          },
          {
            id: "q1-2-5",
            question:
              "What is the Owner/Operator's primary responsibility regarding staff?",
            options: [
              "Designing the ride layout and selecting equipment",
              "Ensuring staff are trained and fulfilling their responsibilities in line with Standard Operating Procedures",
              "Personally performing all daily pre-opening inspections",
              "Managing guest complaints and social media",
            ],
            correctIndex: 1,
            explanation:
              "The Owner/Operator is responsible for operating and maintaining the water ride in accordance with their SOP and ensuring that the staff who operate and maintain the ride are trained and fulfilling their responsibilities.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "1-3",
        title: "What Fails - Real Failure Modes",
        duration: "15 min",
        content: [
          {
            type: "text",
            body: "Understanding how waterslides fail is essential to preventing failure. Incidents rarely come from a single dramatic event - they develop through accumulated degradation, missed inspections and operational shortcuts.",
          },
          {
            heading: "Structural Failures",
            type: "text",
            body: "Structural failures involve the physical integrity of the flume and support system. Cracks are signs of structural damage that require immediate attention. Fiberglass must be applied on both sides of the part. If the damage is too severe, the part may need to be replaced. Large fractures in the fiberglass are less common but very serious - a great amount of force must have been applied to cause them.",
          },
          {
            heading: "Surface Failures",
            type: "text",
            body: "Surface conditions directly impact rider safety. Mineral deposits appear as white scale and can cause unsafe rider conditions. Calcium buildup may cause riders to stick, which leads to unpredictable behaviour and unsafe conditions. UV radiation degrades FRP exposed to sunlight - over time, plastics lose colour and strength, and can crack and deteriorate.",
          },
          {
            heading: "Operational Failures",
            type: "checklist",
            body: "The most common operational failure modes include:",
            items: [
              "Dispatch failures - sending a rider before the previous one has cleared the exit zone",
              "Rider non-compliance - incorrect position, standing, spinning or linking with others",
              "Communication breakdown - loss of contact between top and bottom operators",
              "Flow rate errors - operating with insufficient water, creating dry spots or speed changes",
              "Queue pressure - sacrificing dispatch timing to manage guest volume",
              "Supervision gaps - operator distraction, fatigue or poor positioning",
            ],
          },
          {
            type: "case-study",
            heading: "Real-World Example - Structural Failure",
            body: "In multiple reported incidents across the industry, fiberglass waterslide sections have cracked or separated due to UV degradation, chemical erosion from pool water and fatigue cracking that went undetected by visual inspection alone. In several cases, subsurface delamination was only discovered after a section failed during operation. Scheduled non-destructive testing (tap testing, ultrasonic thickness measurements) and defined service-life replacement criteria could have prevented these failures.",
            source: "Based on CPSC incident reports and industry safety bulletins",
          },
          {
            type: "case-study",
            heading: "Real-World Example - Dispatch Collision",
            body: "Dispatch-related collisions are a recurring pattern across the industry. Riders collide at the bottom of enclosed slides because operators dispatched a second rider before the first cleared the runout zone. Common contributing factors include no visual confirmation of the landing area, over-reliance on timed intervals rather than positive confirmation and pressure to increase throughput during busy periods.",
            source: "Based on industry incident pattern analysis",
          },
          {
            type: "warning",
            body: "Most slide incidents are not technical failures - they are people failures. The intersection of degraded conditions and operational shortcuts is where incidents occur.",
          },
        ],
        keyTakeaways: [
          "Failures fall into three categories: structural, surface-related or operational",
          "Structural cracks require immediate attention and may need part replacement",
          "Surface degradation (mineral deposits, UV damage) directly affects rider safety",
          "Operational failures - especially dispatch errors and communication breakdowns - are the most common incident type",
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
          {
            id: "q1-3-2",
            question:
              "What does it mean that large fractures in fiberglass are 'less common but very serious'?",
            options: [
              "They are only serious if a rider notices them",
              "A great amount of force must have caused them, indicating severe structural damage requiring immediate assessment",
              "They are serious because they are expensive to repair",
              "They are serious only if they are on the exterior of the flume",
            ],
            correctIndex: 1,
            explanation:
              "Large fractures in fiberglass indicate that a great amount of force was applied. This signals severe structural compromise that requires immediate attention - the part may need replacement rather than repair.",
            type: "knowledge",
          },
          {
            id: "q1-3-3",
            question:
              "A supervisor is pressured by management to keep a slide running despite a known flow rate problem because the queues are long. Which failure mode does this represent?",
            options: [
              "Structural failure",
              "Surface failure",
              "Operational failure - specifically queue pressure sacrificing operational safety controls",
              "Hydraulic failure only - the equipment is the problem",
            ],
            correctIndex: 2,
            explanation:
              "Queue pressure that leads to sacrificing operational standards is explicitly listed as an operational failure mode. Most slide incidents are people failures - the intersection of degraded conditions and operational shortcuts.",
            type: "scenario",
          },
          {
            id: "q1-3-4",
            question:
              "UV radiation causes FRP surfaces to lose colour and strength over time. At what point does UV degradation become a safety issue rather than just an aesthetic one?",
            options: [
              "Only when the slide is more than 10 years old",
              "UV degradation is only ever aesthetic - it never affects safety",
              "When degradation has progressed to cracking and deterioration, compromising structural integrity",
              "When the colour fades more than 50%",
            ],
            correctIndex: 2,
            explanation:
              "UV degradation progresses from colour loss to strength loss to cracking and deterioration. Once surfaces crack and deteriorate, structural integrity is compromised - making this a safety issue, not just cosmetic.",
            type: "knowledge",
          },
          {
            id: "q1-3-5",
            question:
              "Which of these represents a 'dispatch failure'?",
            options: [
              "A rider choosing an incorrect position during the ride",
              "Sending a rider before the previous rider has cleared the exit zone",
              "Water flow being slightly below specification",
              "A joint with minor sealant wear",
            ],
            correctIndex: 1,
            explanation:
              "Dispatch failure is specifically defined as sending a rider before the previous rider has cleared the exit zone. This is among the most common operational failure modes and directly creates collision risk.",
            type: "defect",
          },
        ],
      },
    ],
  },
  {
    id: "inspections",
    number: 3,
    title: "Inspections",
    subtitle: "Your First Line of Defence",
    description:
      "Master the daily, periodic and annual inspection procedures that catch problems before they become incidents. Based on industry standards and manufacturer requirements.",
    icon: "clipboard",
    color: "#059669",
    badge: { icon: "clipboard", label: "Certified Inspector" },
    lessons: [
      {
        id: "2-1",
        title: "Daily Pre-Opening Inspection",
        duration: "15 min",
        content: [
          {
            type: "text",
            body: "Every operating day begins with a systematic inspection. This is not a walk-through - it is a structured process that must be completed and documented before any rider enters the slide.",
          },
          {
            type: "oem-reference",
            body: "It is essential that every individual flume is inspected by qualified personnel before each operating day. This inspection should take place before the water supply is turned on.",
          },
          {
            type: "diagram",
            heading: "Inspection Zones",
            body: "The designated zones and checkpoints covered during a structured pre-opening inspection.",
            diagramId: "inspection-zones",
          },
          {
            heading: "Flume Inspection",
            type: "checklist",
            body: "Walk every metre of every flume checking for:",
            items: [
              "Cracks - any crack is a sign of structural damage requiring immediate attention",
              "Chips and gouges - especially on the riding surface",
              "Foreign objects - debris, leaves, insects, vandalism items",
              "Joint condition - sealant failure, separation, sharp edges, lips",
              "Surface condition - mineral deposits, dry rough patches, friction wear",
              "Bolt and fastener integrity - loose, missing or corroded connections",
            ],
          },
          {
            heading: "Structure Inspection",
            type: "checklist",
            body: "Check all structural elements:",
            items: [
              "Handrails - secure, no sharp edges, proper height",
              "Tower and platform - stable, no movement, drainage clear",
              "Support columns - no visible corrosion, connections tight",
              "Stairs and walkways - non-slip surfaces intact, no damage",
              "Signage - all safety signs present and legible",
            ],
          },
          {
            heading: "Water System Check",
            type: "checklist",
            body: "Before turning on water supply:",
            items: [
              "Check pump operation - no unusual noises or vibration",
              "Open clean-out valves and flush until water runs clear",
              "Check all nozzles are functioning - clean any blocked tips",
              "Achieve correct flow rate and water levels before anyone enters start position",
              "First rider should be a lifeguard or attendant as a final operational check",
            ],
          },
          {
            type: "oem-reference",
            body: "Industry best practice recommends that a lifeguard or water ride attendant should be the first to ride each day. This serves as a final operational check to confirm the ride is safe for the general public.",
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
          {
            type: "case-study",
            heading: "Real-World Example - Insufficient Water Flow",
            body: "A rider suffered a spinal injury on a high-speed slide after becoming airborne and landing on a hard surface where water flow was insufficient. Inadequate water flow maintenance created dry spots that altered rider trajectory. Regular flow checks, scheduled pump system maintenance and documented flow-rate inspections before daily operation are critical controls to prevent this type of incident.",
            source: "Based on publicly reported incident, late 1990s",
          },
          {
            type: "case-study",
            heading: "Real-World Example - Joint Deterioration",
            body: "Several incidents at various facilities involved riders' hair or limbs becoming trapped in slide joints or gaps between slide sections, causing lacerations and avulsion injuries. Deteriorated joint covers, gaps from thermal expansion not accounted for and missed findings during routine inspections were common contributing factors. Daily slide surface walk-throughs with documented inspection checklists and immediate closure protocols when gaps exceed manufacturer tolerances are essential prevention measures.",
            source: "Based on industry incident pattern analysis",
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
              "Per manufacturer requirements, the inspection should be performed just prior to turning on the water ride's water supply - before any water flows.",
            type: "knowledge",
          },
          {
            id: "q2-1-2",
            question:
              "During your pre-opening inspection you find a 5cm crack in the flume surface. What do you do?",
            options: [
              "Note it for the weekly maintenance report",
              "Apply tape over it and continue opening",
              "Immediately report it - cracks are signs of structural damage requiring immediate attention",
              "Monitor it throughout the day to see if it gets worse",
            ],
            correctIndex: 2,
            explanation:
              "Per manufacturer guidance, cracks are signs of structural damage that require immediate attention. The slide should not operate until the crack has been assessed and repaired.",
            type: "scenario",
          },
          {
            id: "q2-1-3",
            question:
              "Why should the first rider of the day be a lifeguard or water ride attendant rather than a member of the public?",
            options: [
              "To reward staff with the best ride experience",
              "To act as a final operational check confirming the ride is ready for the general public",
              "Because guests are not allowed until the facility officially opens",
              "To demonstrate correct riding position to waiting guests",
            ],
            correctIndex: 1,
            explanation:
              "Industry best practice recommends that initial riders be a lifeguard or water ride attendant. This acts as a final check that the water ride is ready for the general public - a live operational test after all pre-opening checks are complete.",
            type: "knowledge",
          },
          {
            id: "q2-1-4",
            question:
              "During a pre-opening flume walk you find a foreign object wedged in a joint. What is the correct action?",
            options: [
              "Note it in the log and check again at lunchtime",
              "Remove it and document the finding before opening",
              "Open the slide and monitor whether riders report anything",
              "Only act if the object is large enough to be visible to riders",
            ],
            correctIndex: 1,
            explanation:
              "Foreign objects in the flume are identified as a specific inspection concern. Any object found must be removed and the finding documented before the slide opens - objects can create hazards that riders cannot see or avoid.",
            type: "scenario",
          },
          {
            id: "q2-1-5",
            question:
              "What does 'bolt and fastener integrity' refer to in a flume inspection?",
            options: [
              "The decorative hardware on the slide tower",
              "Checking that all structural connections are tight, not missing and not corroded",
              "The locking mechanism on the starting gate",
              "Fasteners on rider equipment such as life vests",
            ],
            correctIndex: 1,
            explanation:
              "Bolt and fastener integrity means checking for loose, missing or corroded connections throughout the flume structure. Fastener failure can compromise the structural integrity of flume sections and their connections to the support structure.",
            type: "knowledge",
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
            body: "Water flow is not just about making the slide work - it is a critical safety control. Incorrect flow creates dry spots where riders decelerate unpredictably, or excessive speed zones where control is lost.",
          },
          {
            heading: "Flow Rate Requirements",
            type: "text",
            body: "The correct flow rate and water levels must be achieved and maintained prior to allowing anyone to enter the start position. Flow rates are specified by the manufacturer for each individual ride and are documented in the Ride Operations Manual. These are not suggestions - they are engineered limits.",
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
              "Clean non-functioning nozzles by removing tips, cleaning and replacing",
              "System is ready for use only after all nozzles confirmed operational",
            ],
          },
          {
            type: "critical",
            body: "Operating a slide with incorrect water flow is one of the most dangerous operational errors. Dry spots cause riders to stick, decelerate and become vulnerable to collision from following riders. This is a non-negotiable operational control.",
          },
        ],
        keyTakeaways: [
          "Flow rates are engineered limits, not suggestions",
          "Water must be running correctly before any rider enters",
          "Blocked nozzles create dry spots that directly cause incidents",
          "Sprinkler systems require systematic flushing and checking",
        ],
        quiz: [
          {
            id: "q2-2-1",
            question:
              "What should you do if you discover a nozzle is not functioning during your pre-opening check?",
            options: [
              "Ignore it if most other nozzles are working",
              "Remove the tip, clean it, replace it and confirm it works before opening",
              "Report it at the end of the day",
              "Reduce the number of riders allowed on the slide",
            ],
            correctIndex: 1,
            explanation:
              "Non-functioning nozzles must be cleaned by removing tips, cleaning and replacing them. The system is only ready for use after all nozzles are confirmed operational.",
            type: "knowledge",
          },
          {
            id: "q2-2-2",
            question:
              "A rider suddenly decelerates mid-slide and the following rider collides with them. What is the most likely cause?",
            options: [
              "The rider was too light",
              "A dry spot caused by a blocked nozzle reducing water coverage",
              "The slide angle was too steep",
              "Wind interference",
            ],
            correctIndex: 1,
            explanation:
              "Dry spots from blocked nozzles cause riders to decelerate unpredictably, making them vulnerable to collision from following riders. Correct water flow is a non-negotiable operational control.",
            type: "scenario",
          },
          {
            id: "q2-2-3",
            question:
              "Flow rates are described as 'engineered limits, not suggestions.' What does this mean operationally?",
            options: [
              "They are suggestions that can be overridden by experienced operators",
              "They are the minimum required to make the ride comfortable for guests",
              "They are safety-critical values specified per-ride in the Operations Manual that must not be deviated from",
              "They only apply during peak operating hours",
            ],
            correctIndex: 2,
            explanation:
              "Flow rates are engineered limits specified by the manufacturer for each individual ride and documented in the Ride Operations Manual. They define the boundaries within which the ride is safe - operating outside them is an operational control failure.",
            type: "knowledge",
          },
          {
            id: "q2-2-4",
            question:
              "What is the correct sequence for the sprinkler system flush procedure before opening?",
            options: [
              "Turn on water, check jets, clean any blocked nozzles, confirm all working",
              "Turn off pump, open clean-out valves, flush until clear, close clean-out valves, turn on water, check all jets, clean blocked nozzles",
              "Check nozzles visually, then turn on water and open for public",
              "Run a test rider first, then flush the system based on what they report",
            ],
            correctIndex: 1,
            explanation:
              "The correct sequence is: turn off pump, open clean-out valves on drop pipes, allow water to flush until clear, close clean-out valves, turn on water, check all jets, then clean any non-functioning nozzles. The system is only ready after all nozzles are confirmed operational.",
            type: "knowledge",
          },
          {
            id: "q2-2-5",
            question:
              "Late afternoon heat is causing water to evaporate faster from the flume surface between riders. What risk does this create?",
            options: [
              "No risk - evaporation is normal and expected",
              "Reduced rider comfort only",
              "Dry spots may form, creating unpredictable deceleration zones even if the system was functioning correctly at opening",
              "The slide becomes faster, which is generally safer",
            ],
            correctIndex: 2,
            explanation:
              "Even with correct water flow, environmental conditions like heat can create temporary dry spots between riders. This is a known operational risk - operators must monitor surface conditions throughout the day, not just at opening.",
            type: "scenario",
          },
        ],
      },
      {
        id: "2-3",
        title: "Routine vs Periodic vs Thorough Inspections",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Inspections operate at three distinct levels, each with different scope, frequency and qualification requirements. Understanding these tiers prevents both under-inspection (missing defects) and over-reliance on daily checks to catch everything.",
          },
          {
            type: "oem-reference",
            body: "There are four levels of inspection: Routine (daily), Periodic (monthly/quarterly/yearly), Thorough (conducted by a competent professional at set intervals) and Structural (triggered when damage is suspected).",
          },
          {
            heading: "Routine Inspection (Daily)",
            type: "text",
            body: "Performed by facility maintenance staff every operating day. Intended to identify obvious hazards from vandalism, use, excessive wear, weather conditions, foreign bodies, damage and structural integrity issues before starting operation.",
          },
          {
            type: "checklist",
            body: "Example routine inspection checklist items:",
            items: [
              "Walk entire flume - check for cracks, chips, foreign objects and joint condition",
              "Verify all handrails and barriers are secure with no sharp edges",
              "Check pump operation - listen for unusual noise or vibration",
              "Confirm all nozzles are functioning and flow rate is correct",
              "Test communication equipment between top and bottom positions",
              "Verify all safety signage is present and legible",
              "Confirm lifesaving and emergency equipment is in place",
              "Record all findings in the daily inspection log",
            ],
          },
          {
            heading: "Periodic Inspection (Monthly/Quarterly/Yearly)",
            type: "text",
            body: "More detailed than routine inspection. Performed by facility maintenance staff to assess operation and stability of equipment, identify damage, wear and corrosion. Includes checking all mechanical systems, reviewing maintenance logs and assessing component lifecycle status.",
          },
          {
            type: "checklist",
            body: "Example periodic inspection checklist items:",
            items: [
              "Detailed assessment of all joint sealant condition and integrity",
              "Bolt torque checks on structural connections",
              "Corrosion assessment on all steel and metal components",
              "Pump performance testing against manufacturer specifications",
              "Review of maintenance logs for recurring issues or trends",
              "Surface condition assessment - friction testing and wear measurement",
              "Component lifecycle review against manufacturer replacement schedules",
            ],
          },
          {
            heading: "Thorough Inspection (Professional)",
            type: "text",
            body: "A detailed visual inspection carried out by a competent professional at defined intervals, covering all components for signs of wear, structural degradation, corrosion (internal and external) or cracking. May be supplemented by non-destructive testing if deemed necessary.",
          },
          {
            heading: "Structural Inspection (As Needed)",
            type: "text",
            body: "Triggered when damage, distress or deterioration is suspected or known to exist. The purpose is to determine if the structure or component is structurally adequate to continue operating. This is a specialist assessment, not a staff-level check.",
          },
        ],
        keyTakeaways: [
          "Four tiers: Routine (daily), Periodic (monthly+), Thorough (professional), Structural (specialist)",
          "Daily inspections catch obvious hazards - they don't replace deeper inspection",
          "Periodic inspections assess wear, corrosion and component lifecycle",
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
              "Ignore it - corrosion is normal on steel",
              "Close the entire facility immediately",
            ],
            correctIndex: 1,
            explanation:
              "Routine inspections identify issues; they don't resolve structural concerns. Corrosion should be documented and escalated to the appropriate inspection tier - periodic or thorough - performed by qualified personnel.",
            type: "scenario",
          },
          {
            id: "q2-3-2",
            question:
              "What is the key difference between a Thorough Inspection and a Routine Inspection?",
            options: [
              "Thorough inspections are done more frequently",
              "Routine inspections check more components",
              "Thorough inspections are performed by a competent professional and may include non-destructive testing",
              "There is no meaningful difference - both cover the same scope",
            ],
            correctIndex: 2,
            explanation:
              "Thorough inspections are performed by a competent professional and involve detailed visual inspection of all components for wear, structural degradation and corrosion. They may also be supplemented by non-destructive testing - a level of assessment beyond what routine staff inspections can achieve.",
            type: "knowledge",
          },
          {
            id: "q2-3-3",
            question:
              "A Structural Inspection is triggered when which condition exists?",
            options: [
              "The annual calendar date for the scheduled inspection arrives",
              "A new lifeguard joins the team and needs orientation",
              "Damage, distress, or deterioration is suspected or known to exist",
              "Routine inspection finds minor mineral deposits",
            ],
            correctIndex: 2,
            explanation:
              "A Structural Inspection is triggered when damage, distress or deterioration is suspected or known. Its purpose is to determine whether the structure or component is structurally adequate to continue operating - it is a specialist assessment, not a scheduled routine.",
            type: "knowledge",
          },
          {
            id: "q2-3-4",
            question:
              "What is the primary purpose of Periodic Inspections (monthly/quarterly/yearly)?",
            options: [
              "To replace daily inspections when staff are short",
              "To assess operation and stability, identify damage, wear and corrosion and review component lifecycle status",
              "To train new staff on what to look for",
              "To fulfil insurance requirements only",
            ],
            correctIndex: 1,
            explanation:
              "Periodic inspections are more detailed than routine checks. They assess operation and stability, identify damage, wear and corrosion, review maintenance logs and assess component lifecycle status. They go beyond what a daily routine inspection covers.",
            type: "knowledge",
          },
          {
            id: "q2-3-5",
            question:
              "A daily routine inspection finds what appears to be delamination (layer separation) in a section of the flume. The defect is not a crack and the surface is intact. What is the correct next step?",
            options: [
              "Continue operating - the surface is intact so it is safe",
              "Repair it yourself with fiberglass patch material",
              "Document it and escalate for assessment by qualified personnel - delamination is a structural concern beyond routine inspection scope",
              "Paint over the area and re-inspect in one week",
            ],
            correctIndex: 2,
            explanation:
              "Delamination indicates internal structural degradation that requires assessment beyond a routine inspection. Daily inspections catch obvious hazards - they don't replace deeper structural assessment. This should be documented and escalated to the appropriate inspection tier.",
            type: "defect",
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
            body: "The decision to shut a slide is one of the most important judgement calls an operator makes. There are non-negotiable shutdown conditions that must always be followed.",
          },
          {
            type: "critical",
            body: "The following conditions require immediate shutdown - no exceptions, no 'monitoring it for a while':",
          },
          {
            type: "checklist",
            body: "Immediate shutdown triggers:",
            items: [
              "Any crack in the flume surface - structural damage requiring immediate attention",
              "Punctures or holes - integrity of the riding surface is compromised",
              "Joint failure - sealant separation creating lips or sharp edges",
              "Incorrect water flow - flow rate below manufacturer specification",
              "Blocked nozzles creating dry zones - unpredictable rider deceleration",
              "Large fractures - especially on bolting flanges critical to structural integrity",
              "Missing or damaged safety signage",
              "Communication system failure between operators",
              "Any condition where the exit zone cannot be confirmed clear",
            ],
          },
          {
            type: "oem-reference",
            body: "It is critical that a flume with any deficiency must not be operated until the issue is corrected. Fractures to any slide component have the potential to severely compromise the structural integrity of the section and must be repaired without delay.",
          },
          {
            type: "warning",
            body: "The cost of shutting a slide is always less than the cost of an incident. Every time. Queue pressure, management pressure and guest complaints are not valid reasons to keep a compromised slide operating.",
          },
        ],
        keyTakeaways: [
          "Specific conditions require immediate, non-negotiable shutdown",
          "Cracks, punctures, joint failure and incorrect flow are always shutdown triggers",
          "The cost of closure is always less than the cost of an incident",
          "External pressure to remain open is never a valid safety override",
        ],
        quiz: [
          {
            id: "q2-4-1",
            question:
              "You notice a joint has separated and created a small lip on the flume surface. Guest queues are at peak capacity. What do you do?",
            options: [
              "Monitor it through the day and report at close",
              "Shut the slide immediately - joint failure creating a lip is a non-negotiable shutdown trigger",
              "Reduce dispatch intervals to lower the risk",
              "Cover it with tape until maintenance arrives",
            ],
            correctIndex: 1,
            explanation:
              "Joint failure creating lips or sharp edges is an immediate shutdown condition. Queue pressure and guest complaints are never valid reasons to keep a compromised slide operating.",
            type: "scenario",
          },
          {
            id: "q2-4-2",
            question:
              "Which of the following is NOT listed as an immediate shutdown trigger?",
            options: [
              "Missing or damaged safety signage",
              "A single rider complaint about speed",
              "Communication system failure between operators",
              "Any crack in the flume surface",
            ],
            correctIndex: 1,
            explanation:
              "A single rider complaint is not an automatic shutdown trigger, though it should be investigated. Missing signage, communication failure and flume cracks are all non-negotiable shutdown conditions.",
            type: "knowledge",
          },
          {
            id: "q2-4-3",
            question:
              "Management tells an operator to keep a slide running despite a confirmed communication failure between top and bottom positions because they are only 15 minutes from closing. What is the correct response?",
            options: [
              "Continue at reduced capacity since closing is imminent",
              "Shut the slide immediately - communication failure is a non-negotiable shutdown trigger regardless of timing",
              "Ask the bottom operator to wave a towel as a visual signal instead",
              "Continue operating but increase dispatch intervals as a precaution",
            ],
            correctIndex: 1,
            explanation:
              "Communication system failure is an immediate shutdown trigger with no exceptions. The lesson content is explicit: external pressure to remain open is never a valid safety override. If you cannot confirm exit clearance, you cannot dispatch.",
            type: "scenario",
          },
          {
            id: "q2-4-4",
            question:
              "What is the requirement regarding use of a deficient flume?",
            options: [
              "Deficient flumes may be used at reduced capacity until repairs can be scheduled",
              "Do not use a deficient flume until corrected - fractures seriously degrade structural integrity and must be fixed immediately",
              "Minor deficiencies can be managed with increased supervision",
              "Deficiencies only matter if they are in the rider contact zone",
            ],
            correctIndex: 1,
            explanation:
              "The position is unambiguous: do not use a deficient flume until corrected. Any fractures to a slide component could seriously degrade structural integrity and must be fixed immediately - not managed, monitored or worked around.",
            type: "knowledge",
          },
          {
            id: "q2-4-5",
            question:
              "You are the top operator and the exit zone is not yet clear, but you can see the queue is very long and guests are becoming impatient. What is the only acceptable action?",
            options: [
              "Dispatch the next rider to keep queue moving and trust the bottom operator to manage the exit",
              "Wait until you receive confirmed clearance from the bottom operator before dispatching",
              "Dispatch only if the previous rider appears to be nearly out of the exit zone",
              "Ask a supervisor to approve the dispatch decision",
            ],
            correctIndex: 1,
            explanation:
              "Dispatch requires confirmed exit clearance every single time. Queue pressure is explicitly not a valid reason to override this control. 'Almost clear' is not clear - visual or communicated confirmation of exit clearance is required before every dispatch.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "surface-rider-interaction",
    number: 4,
    title: "Surface and Rider Interaction",
    subtitle: "Where Physics Meets Safety",
    description:
      "Learn why surface condition is a critical safety control - not just cosmetic. From mineral deposits to UV degradation, understand how surface changes create incidents.",
    icon: "waves",
    color: "#d97706",
    badge: { icon: "waves", label: "Surface Specialist" },
    lessons: [
      {
        id: "3-1",
        title: "Why Surface Condition Matters",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Surface condition is not cosmetic maintenance - it is a direct safety control. The interaction between the rider's body (or raft) and the flume surface determines speed, control and predictability. When surface conditions change, rider behaviour becomes unpredictable.",
          },
          {
            type: "oem-reference",
            body: "Keeping surfaces washed and waxed is essential for safe operation. Calcium buildup is a particular concern, as it can cause riders to stick - leading to unpredictable behaviour and unsafe conditions.",
          },
          {
            type: "diagram",
            heading: "Surface Condition Severity Scale",
            body: "A visual scale showing how surface defect severity is classified from minor buildup to immediate shutdown conditions.",
            diagramId: "surface-defects",
          },
          {
            heading: "Mineral Deposits",
            type: "text",
            body: "Water readily dissolves minerals from the ground and carries them as Total Dissolved Solids (TDS). When water evaporates from the flume surface, it leaves behind crystalline mineral deposits - calcium carbonate, calcium sulfate, magnesium compounds, iron, manganese and others. These deposits appear as white scale ('water spots') and bond aggressively to surfaces. They create rough, high-friction zones that slow or stop riders unpredictably.",
          },
          {
            heading: "The Chemistry of Removal",
            type: "text",
            body: "Mineral deposits are salts. Removing them requires acid mixtures that dissolve the crystalline bonds. No single acid handles all mineral types - a combination is needed. Three variables control the reaction: acid concentration (limited by worker safety), temperature (higher = faster reaction) and time (the main controllable variable in site operations).",
          },
          {
            type: "warning",
            body: "A flume that looks clean can still have microscopic mineral buildup that changes rider dynamics. Regular cleaning and waxing should be performed in line with the manufacturer's recommended schedule and adapted to your facility's conditions - frequency will depend on water chemistry, usage levels and environmental exposure. This is a safety requirement, not just an aesthetic preference.",
          },
        ],
        keyTakeaways: [
          "Surface condition directly controls rider speed, control and predictability",
          "Mineral deposits cause riders to stick - creating collision risk",
          "Cleaning requires specific acid chemistry, not just soap and water",
          "Regular buffing and waxing cycles per manufacturer schedules are a safety requirement",
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
              "Calcium buildup may cause riders to stick, which leads to unpredictable behaviour and unsafe conditions - primarily collision risk from following riders.",
            type: "knowledge",
          },
          {
            id: "q3-1-2",
            question:
              "What are Total Dissolved Solids (TDS) and why do they matter for slide safety?",
            options: [
              "TDS measures water temperature - high TDS means warmer water which affects rider comfort",
              "TDS are minerals dissolved in water that deposit as crystalline scale on flume surfaces when water evaporates, creating high-friction zones",
              "TDS is a measure of water clarity - high TDS only affects visibility in the catch pool",
              "TDS refers to debris such as leaves and insects carried by water flow",
            ],
            correctIndex: 1,
            explanation:
              "TDS (Total Dissolved Solids) are minerals that water dissolves from the ground. When water evaporates from flume surfaces, these minerals are left behind as crystalline deposits - calcium carbonate, magnesium compounds and others - that create rough, high-friction zones affecting rider speed and predictability.",
            type: "knowledge",
          },
          {
            id: "q3-1-3",
            question:
              "Why do mineral deposits require acid mixtures to remove rather than standard cleaning agents?",
            options: [
              "Standard cleaning agents would damage the FRP surface",
              "Mineral deposits are crystalline salts that only dissolve with acid chemistry - no single acid handles all mineral types",
              "Acid is cheaper and faster to apply than standard cleaners",
              "Standard cleaners leave a residue that affects water chemistry",
            ],
            correctIndex: 1,
            explanation:
              "Mineral deposits are salts with crystalline bonds. Removing them requires acid mixtures that dissolve those bonds. No single acid handles all mineral types, so a combination is needed - this is why specialist cleaning chemistry is required, not just standard soap and water.",
            type: "knowledge",
          },
          {
            id: "q3-1-4",
            question:
              "What classification does regular buffing and waxing of flume surfaces have?",
            options: [
              "Once per season, as a cosmetic maintenance preference",
              "Only when visible discolouration is observed",
              "Per the manufacturer's recommended schedule, as a safety requirement - not just aesthetic preference",
              "Annually, alongside the thorough inspection",
            ],
            correctIndex: 2,
            explanation:
              "Regular buffing and waxing per manufacturer schedules is a safety requirement. Waxed surfaces are critical to proper and safe operation - a flume that looks clean can still have microscopic mineral buildup that changes rider dynamics. The exact frequency will depend on your facility's conditions.",
            type: "knowledge",
          },
          {
            id: "q3-1-5",
            question:
              "An operator notices riders are slowing in one section but the flume surface looks clean to the naked eye. Why might this still be a surface condition issue?",
            options: [
              "It cannot be a surface issue if the flume looks clean - look for other causes first",
              "Microscopic mineral buildup can change rider dynamics even when the surface appears visually clean",
              "The issue must be a water flow problem since the surface is clearly fine",
              "Rider weight variations explain all speed differences - no investigation needed",
            ],
            correctIndex: 1,
            explanation:
              "A flume that looks clean can still have microscopic mineral buildup that changes rider dynamics. Surface condition issues are not always visible - this is why scheduled cleaning cycles are a safety requirement rather than something done only when problems are visible.",
            type: "scenario",
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
            body: "Understanding the types of surface degradation helps you identify problems early and determine the correct response - from routine maintenance to immediate shutdown.",
          },
          {
            heading: "UV Degradation",
            type: "text",
            body: "UV radiation degrades FRP exposed to sunlight. Over time, plastics lose their colour and strength, and can eventually crack and deteriorate, requiring replacement. Manufacturers use UV-inhibiting pigments, but reapplying absorbers and eventually gelcoat is needed over time. On surfaces with UV absorbent clear coat, any refinishing requires a new clear coat application.",
          },
          {
            heading: "Friction Wear",
            type: "text",
            body: "Riders wear down slide surfaces through direct contact. Ideally water separates riders from the surface, but movement causes contact. Airborne dust and metal objects on clothing also scratch surfaces between riders and the flume. These scratches require sanding, filling and gelcoat reapplication.",
          },
          {
            heading: "Gelcoat Failure",
            type: "text",
            body: "Gelcoat is the protective outer layer of the FRP. When it fails - through peeling, fading, cracking or wearing through - the structural fiberglass beneath is exposed to water, chemicals and UV. This accelerates degradation and creates rough surfaces that affect rider safety.",
          },
          {
            heading: "Stickers and Adhesives",
            type: "text",
            body: "Remove stickers with soap and warm water and a soft putty scraper. Residual adhesive creates sticky spots on the riding surface that can catch riders.",
          },
        ],
        keyTakeaways: [
          "UV degradation is progressive - surfaces lose colour, strength, then crack",
          "Friction wear from riders requires periodic sanding and gelcoat repair",
          "Gelcoat failure exposes structural fiberglass to accelerated degradation",
          "Even minor surface issues such as sticker residue can affect rider dynamics",
        ],
        quiz: [
          {
            id: "q3-2-1",
            question:
              "What happens when gelcoat fails on a fiberglass slide surface?",
            options: [
              "The slide looks faded but functions normally",
              "The structural fiberglass beneath is exposed to water, chemicals and UV - accelerating degradation",
              "The slide becomes faster due to reduced friction",
              "It only affects the colour of the slide",
            ],
            correctIndex: 1,
            explanation:
              "Gelcoat is the protective outer layer. When it fails, the structural fiberglass is exposed to water, chemicals and UV, which accelerates degradation and creates rough surfaces affecting rider safety.",
            type: "defect",
          },
          {
            id: "q3-2-2",
            question:
              "How should sticker residue on the flume surface be treated?",
            options: [
              "Leave it - stickers are cosmetic only",
              "Use lacquer thinner to dissolve it quickly",
              "Remove with soap, warm water and a soft putty scraper",
              "Sand it down with coarse grit sandpaper",
            ],
            correctIndex: 2,
            explanation:
              "Stickers should be removed with soap, warm water and a soft putty scraper. Residual adhesive creates sticky spots that can catch riders, making it a safety issue, not just cosmetic.",
            type: "knowledge",
          },
          {
            id: "q3-2-3",
            question:
              "During inspection you find a section of flume where the gelcoat has worn through and the fiberglass beneath is exposed to water. What is the risk if this is not repaired?",
            options: [
              "No safety risk - the fiberglass is strong enough without the gelcoat",
              "The exposed fiberglass will absorb water and chemicals, accelerating degradation, while also creating a rough surface that affects rider safety",
              "The risk is only cosmetic - the slide will look worse but function the same",
              "It will reduce water flow in that section only",
            ],
            correctIndex: 1,
            explanation:
              "Gelcoat is the protective outer layer. When it fails and the structural fiberglass is exposed, water, chemicals and UV accelerate degradation of the structural material beneath. The rough exposed surface also directly affects rider dynamics - creating friction that changes speed and predictability.",
            type: "defect",
          },
          {
            id: "q3-2-4",
            question:
              "UV radiation affects FRP surfaces in a specific progressive sequence. What is the correct order of degradation?",
            options: [
              "Cracking, then colour loss, then strength loss",
              "Colour loss, then strength loss, then cracking and deterioration requiring replacement",
              "Strength loss first, then cracking, then colour change",
              "All effects occur simultaneously from first sun exposure",
            ],
            correctIndex: 1,
            explanation:
              "UV degradation progresses in sequence: first plastics lose colour, then strength and eventually crack and deteriorate - potentially requiring replacement. Understanding this progression means early colour change should prompt assessment of underlying strength rather than being dismissed as purely cosmetic.",
            type: "knowledge",
          },
          {
            id: "q3-2-5",
            question:
              "A ride has a UV-absorbent clear coat applied over the gelcoat. During a repair, this clear coat is sanded through. What must happen before the repaired section is returned to service?",
            options: [
              "Nothing additional - sanding and gelcoat repair is sufficient",
              "Apply a UV-inhibiting pigment layer over the repair",
              "A new UV-absorbent clear coat must be applied to restore protection",
              "The entire flume section must be replaced",
            ],
            correctIndex: 2,
            explanation:
              "On surfaces with UV-absorbent clear coat, any refinishing requires a new clear coat application. Without it, the underlying material loses its UV protection and will degrade faster - making this a maintenance requirement, not optional.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "3-3",
        title: "Operational Impacts of Surface Changes",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Surface condition changes don't just affect the appearance of the slide - they directly alter how riders move through it. An operator who understands these dynamics can anticipate problems before they become incidents.",
          },
          {
            heading: "Speed Changes",
            type: "text",
            body: "Rough surfaces slow riders. Smooth, freshly waxed surfaces speed them up. Mineral deposits create variable friction zones where riders accelerate and decelerate unpredictably. This makes dispatch timing unreliable because the assumed travel time no longer holds.",
          },
          {
            heading: "Rider Collisions",
            type: "text",
            body: "When a rider decelerates unexpectedly - whether from a rough patch, dry spot or deposit - the following rider on the original dispatch timing will close the gap. If that gap closes to zero, you have a collision. This is the single most common slide incident pattern.",
          },
          {
            heading: "Rider Stoppages",
            type: "text",
            body: "In severe cases, riders stop completely within the flume. This is extremely dangerous in enclosed slides where following riders cannot see the obstruction. Surface maintenance is directly linked to stoppage prevention.",
          },
          {
            type: "critical",
            body: "If you notice riders moving slower than usual, or if you receive reports of riders stopping, this is a surface condition issue. Do not simply increase dispatch intervals - investigate and address the root cause.",
          },
        ],
        keyTakeaways: [
          "Surface condition directly controls rider speed and predictability",
          "Variable friction zones make standard dispatch timing unreliable",
          "Rider collision from unexpected deceleration is the most common incident pattern",
          "Speed changes require root cause investigation, not just dispatch adjustments",
        ],
        quiz: [
          {
            id: "q3-3-1",
            question:
              "Riders are consistently moving slower than usual through a particular section. What is the correct response?",
            options: [
              "Increase dispatch intervals and continue operating",
              "Investigate the root cause - likely a surface condition issue creating friction",
              "Speed them up by increasing water flow beyond manufacturer specification",
              "Ignore it as long as no collisions have occurred",
            ],
            correctIndex: 1,
            explanation:
              "Speed changes indicate a surface condition issue that needs root cause investigation. Simply adjusting dispatch intervals treats the symptom, not the problem, and does not prevent the underlying risk.",
            type: "scenario",
          },
          {
            id: "q3-3-2",
            question:
              "What is the single most common waterslide incident pattern?",
            options: [
              "Riders falling off the slide at curves",
              "Rider collision caused by unexpected deceleration from surface conditions",
              "Equipment failure during operation",
              "Riders entering the slide without permission",
            ],
            correctIndex: 1,
            explanation:
              "When a rider decelerates unexpectedly from a rough patch, dry spot or deposit, the following rider on standard dispatch timing closes the gap. This collision pattern is the most common slide incident.",
            type: "knowledge",
          },
          {
            id: "q3-3-3",
            question:
              "Why is a rider stoppage inside an enclosed slide particularly dangerous compared to an open flume?",
            options: [
              "Enclosed slides have higher water pressure which makes stoppages more painful",
              "Following riders cannot see the stopped rider, so they cannot prepare for or avoid the collision",
              "Enclosed slides are longer, giving riders more time to reach dangerous speeds",
              "There is no meaningful difference - stoppages are equally dangerous in both types",
            ],
            correctIndex: 1,
            explanation:
              "In enclosed slides, following riders cannot see obstructions ahead of them. A stopped rider inside an enclosed flume means the following rider arrives at full speed with no warning and no ability to react. Surface maintenance that prevents stoppages is therefore especially critical for enclosed slides.",
            type: "knowledge",
          },
          {
            id: "q3-3-4",
            question:
              "Variable friction zones from mineral deposits affect dispatch timing in a specific way. What is this effect?",
            options: [
              "Dispatch timing becomes more predictable because deposits slow all riders equally",
              "Standard dispatch timing becomes unreliable because assumed travel times no longer hold",
              "Dispatch timing can be shortened because slower riders leave more buffer time",
              "Deposits only affect the first rider of the day - timing normalises after that",
            ],
            correctIndex: 1,
            explanation:
              "Mineral deposits create variable friction where riders accelerate and decelerate unpredictably. This makes dispatch timing based on assumed travel times unreliable - the same rider can take significantly different amounts of time to traverse the same section depending on where deposits have formed.",
            type: "knowledge",
          },
          {
            id: "q3-3-5",
            question:
              "An operator notices that riders are moving slower than usual. Their supervisor suggests simply increasing dispatch intervals as a fix. Why is this response inadequate?",
            options: [
              "It is adequate - increasing intervals directly prevents collisions",
              "Increasing intervals treats the symptom but not the root cause - the underlying surface condition issue remains and could worsen",
              "Intervals cannot be adjusted without manufacturer approval",
              "It is inadequate only if the ride has enclosed sections",
            ],
            correctIndex: 1,
            explanation:
              "Simply increasing dispatch intervals treats the symptom (collision risk) but not the root cause (surface condition). The surface condition will continue to deteriorate if not investigated and addressed. Operators must investigate and fix the underlying problem, not just adjust dispatch timing to work around it.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "core-operations",
    number: 5,
    title: "Core Operations",
    subtitle: "The Operator Skillset",
    description:
      "Master the essential operational skills: pre-dispatch checks, rider positioning, dispatch control and exit monitoring. No fluff - aligned with real operational requirements.",
    icon: "controls",
    color: "#7c3aed",
    badge: { icon: "controls", label: "Operations Pro" },
    lessons: [
      {
        id: "4-1",
        title: "Pre-Dispatch Safety Controls",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Pre-dispatch is the last point where you can prevent an incident. Once a rider is moving, your control is limited. Every dispatch decision must confirm three things: the rider is eligible, the slide is ready and the exit is clear.",
          },
          {
            type: "diagram",
            heading: "Dispatch Sequence Flow",
            body: "The step-by-step operational flow from queue entry through dispatch confirmation and exit clearance.",
            diagramId: "dispatch-flow",
          },
          {
            heading: "Rider Eligibility",
            type: "checklist",
            body: "Before every dispatch, confirm:",
            items: [
              "Height requirement met (as posted for the specific ride)",
              "Weight within range (particularly for raft rides with maximum load limits)",
              "No prohibited items (glasses, jewellery, loose clothing, cameras)",
              "Appropriate swimwear (no clothing with zippers, buckles or rivets)",
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
          "Never dispatch on assumed timing - require confirmed clearance",
        ],
        quiz: [
          {
            id: "q4-1-1",
            question:
              "A guest at the top of the slide is wearing sunglasses and a GoPro chest mount. They meet the height requirement. What do you do?",
            options: [
              "Let them ride - they meet the height requirement",
              "Ask them to remove the sunglasses but the GoPro is fine",
              "Require removal of both the sunglasses and camera before dispatch",
              "Ask a supervisor to make the decision",
            ],
            correctIndex: 2,
            explanation:
              "Loose items including glasses and cameras are prohibited. They can detach during the ride, injure the rider or following riders and create obstructions in the flume.",
            type: "scenario",
          },
          {
            id: "q4-1-2",
            question:
              "Which of the following is a required slide readiness confirmation before each dispatch?",
            options: [
              "The rider has previous waterslide experience",
              "The previous rider has completely exited the catch pool",
              "The ambient temperature is above a minimum threshold",
              "The queue has fewer than ten riders waiting",
            ],
            correctIndex: 1,
            explanation:
              "One of the four required slide readiness checks is that the previous rider has completely exited the catch pool. The others are: correct water flow, no visual obstructions at the entry and confirmed communication with the exit operator.",
            type: "knowledge",
          },
          {
            id: "q4-1-3",
            question:
              "A rider shows visible signs of intoxication but insists they are fine. They meet the height and weight requirements. What is the correct action?",
            options: [
              "Allow them to ride if they can stand upright unaided",
              "Allow them to ride but inform the exit operator to watch closely",
              "Refuse dispatch - signs of intoxication are a listed eligibility exclusion",
              "Let a supervisor decide since the physical requirements are met",
            ],
            correctIndex: 2,
            explanation:
              "No signs of intoxication or impairment is a listed rider eligibility requirement. This is not a judgment call - it is a clear pre-dispatch control. A rider showing signs of intoxication does not ride, regardless of meeting other physical requirements.",
            type: "scenario",
          },
          {
            id: "q4-1-4",
            question:
              "What type of swimwear is explicitly prohibited on waterslides?",
            options: [
              "Swimwear with a UV protection rating",
              "Swimwear with zippers, buckles or rivets",
              "Board shorts longer than the knee",
              "Swimwear with a drawstring waist",
            ],
            correctIndex: 1,
            explanation:
              "Clothing with zippers, buckles or rivets is prohibited. These hard metal elements can catch on the flume surface, cause abrasion injuries to the rider and damage the gelcoat over time.",
            type: "knowledge",
          },
          {
            id: "q4-1-5",
            question:
              "Pre-dispatch is described as the last control point. What does this mean operationally?",
            options: [
              "It is the most time-consuming part of the operation",
              "Once the rider is moving, your ability to prevent an incident is very limited",
              "It is the only point where supervisors can override your decisions",
              "It refers to the final paperwork check at end of shift",
            ],
            correctIndex: 1,
            explanation:
              "Pre-dispatch is the last point where you can prevent an incident. Once a rider is in the system and moving, your control is extremely limited. This is why every eligibility and readiness check must be completed before dispatch - not assumed or skipped under queue pressure.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "4-2",
        title: "Dispatch Timing - Risk-Based Decisions",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "Dispatch timing is not a fixed number - it is a risk-based decision that must account for real-time conditions. The interval between riders is your primary collision prevention control.",
          },
          {
            heading: "Factors That Affect Dispatch Timing",
            type: "checklist",
            body: "Dispatch intervals should be adjusted for:",
            items: [
              "Water flow rate - reduced flow = slower riders = longer intervals needed",
              "Rider size - heavier riders travel faster; lighter riders (especially children) travel slower",
              "Surface condition - rougher surfaces slow riders unpredictably",
              "Slide type - enclosed slides require longer intervals (no visual confirmation mid-ride)",
              "Weather conditions - wind, rain and temperature affect rider speed",
              "Time of day - late afternoon heat can dry surfaces faster between riders",
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
          "Dispatch timing is dynamic, not fixed - adjust for real-time conditions",
          "Six factors affect interval: flow, rider size, surface, slide type, weather and time of day",
          "Small speed differences close gaps rapidly at slide velocities",
          "When in doubt, increase the interval - longer waits don't cause incidents",
        ],
        quiz: [
          {
            id: "q4-2-1",
            question:
              "A light child has just been dispatched. A heavy adult is next in line. What should you do with the dispatch interval?",
            options: [
              "Use the standard interval - it is the same for all riders",
              "Decrease the interval because the adult will clear the slide faster",
              "Increase the interval because the heavier adult will travel faster and could close the gap on the slower child",
              "Ask the adult to wait until the child has exited, then use the standard interval",
            ],
            correctIndex: 2,
            explanation:
              "Heavier riders travel faster than lighter riders. If a heavy adult follows a light child at standard timing, the speed difference will close the gap rapidly, risking collision. Increase the interval to account for the weight difference.",
            type: "scenario",
          },
          {
            id: "q4-2-2",
            question:
              "Which of the following is NOT one of the six factors that affect dispatch timing?",
            options: [
              "Water flow rate",
              "The rider's swimming ability",
              "Surface condition",
              "Weather conditions",
            ],
            correctIndex: 1,
            explanation:
              "The six factors are: water flow rate, rider size/weight, surface condition, slide type, weather conditions and time of day. Swimming ability is not a dispatch timing factor.",
            type: "knowledge",
          },
          {
            id: "q4-2-3",
            question:
              "Why do enclosed slides require longer dispatch intervals than open slides?",
            options: [
              "Enclosed slides are always longer in total length",
              "There is no visual confirmation possible mid-ride, so you cannot detect a problem in time to stop the next dispatch",
              "Enclosed slides have lower water flow rates by design",
              "Rider speed is always slower in enclosed slides due to air resistance",
            ],
            correctIndex: 1,
            explanation:
              "In enclosed slides, neither the top nor bottom operator has visibility into the mid-section. If a rider slows or stops, you have no way to detect this before dispatching the next rider. Longer intervals compensate for this lack of mid-ride visibility.",
            type: "knowledge",
          },
          {
            id: "q4-2-4",
            question:
              "At what speed range does a typical adult travel through a waterslide?",
            options: [
              "5 to 10 km/h",
              "10 to 20 km/h",
              "20 to 40 km/h",
              "40 to 60 km/h",
            ],
            correctIndex: 2,
            explanation:
              "A typical adult travels at 20-40 km/h on a waterslide. At these speeds, even small differences in rider speed close gaps rapidly - which is why dispatch timing decisions must account for weight differences and surface conditions.",
            type: "knowledge",
          },
          {
            id: "q4-2-5",
            question:
              "Late afternoon heat on a hot day may require you to increase dispatch intervals. Why?",
            options: [
              "Riders are more fatigued in the afternoon and move more slowly",
              "Water flow pressure drops in the afternoon due to increased facility demand",
              "Surface heat can dry the flume faster between riders, creating high-friction zones",
              "UV radiation affects the structural integrity of the flume in peak heat",
            ],
            correctIndex: 2,
            explanation:
              "Time of day is one of the six dispatch timing factors. Late afternoon heat can dry out flume surfaces more quickly between riders. A dry or partially dry surface increases friction unpredictably, slowing riders and potentially closing gaps with following riders.",
            type: "scenario",
          },
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
            body: "Riding position varies by slide type and is specified in the manufacturer's operations manual. Generally: body slides require a supine (lying back, feet first) position. Raft slides have specific seating configurations for single, double or multi-rider rafts. The rider must be in the correct position before dispatch - not correcting themselves mid-ride.",
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
            body: "Instructions must be clear, assertive and consistent. Use the same phrasing every time: 'Cross your arms over your chest. Lie back. Feet first.' Repetition builds compliance. If a rider refuses to comply after clear instruction, they do not ride. This is non-negotiable.",
          },
        ],
        keyTakeaways: [
          "Rider positioning is an active control function, not passive",
          "Position must be correct BEFORE dispatch, not corrected mid-ride",
          "Six high-risk behaviours require immediate intervention",
          "Non-compliance after clear instruction = no ride, no exceptions",
        ],
        quiz: [
          {
            id: "q4-3-1",
            question:
              "A rider wants to go head-first on a body slide that requires feet-first positioning. They insist they have done it before at another park. What do you do?",
            options: [
              "Allow it since they have experience",
              "Let them go head-first but tell the exit operator to watch closely",
              "Require feet-first positioning - the riding position is specified by the manufacturer and is non-negotiable",
              "Ask a supervisor to make an exception",
            ],
            correctIndex: 2,
            explanation:
              "Riding position is specified by the manufacturer for each slide type. Non-compliance after clear instruction means the rider does not ride. Previous experience at other parks is irrelevant to the safety requirements of this specific slide.",
            type: "scenario",
          },
          {
            id: "q4-3-2",
            question:
              "When giving rider instructions, what is the recommended communication approach?",
            options: [
              "Vary your phrasing to keep it interesting for repeat visitors",
              "Use the same clear, assertive phrasing every time to build compliance through repetition",
              "Keep instructions minimal to avoid slowing the queue",
              "Only give instructions to riders who look unsure",
            ],
            correctIndex: 1,
            explanation:
              "Instructions must be clear, assertive and consistent. Using the same phrasing every time builds compliance through repetition. All riders receive instructions, not just those who appear uncertain.",
            type: "knowledge",
          },
          {
            id: "q4-3-3",
            question:
              "A parent wants to hold their young child on their lap on a body slide. The slide's operations manual does not list this as a permitted configuration. What do you do?",
            options: [
              "Allow it if the child is very young and cannot ride alone",
              "Allow it but require them to sit at the back of the slide",
              "Refuse - lap-riding is prohibited unless the ride-specific rules explicitly allow it",
              "Allow it if the parent signs a waiver",
            ],
            correctIndex: 2,
            explanation:
              "Holding children on laps is listed as a high-risk behaviour requiring immediate intervention unless ride-specific rules explicitly allow it. If the manufacturer's manual does not permit it for this slide, it is not permitted regardless of the parent's preference.",
            type: "scenario",
          },
          {
            id: "q4-3-4",
            question:
              "Rider positioning must be correct before dispatch, not corrected mid-ride. Why is this important?",
            options: [
              "It is mainly for the operator's convenience and to keep the queue moving",
              "Once in the flume, a rider cannot be stopped or repositioned safely - the wrong position continues through the entire ride",
              "It is a legal formality required by the insurance policy",
              "Riders are more likely to comply at the top than they are mid-ride",
            ],
            correctIndex: 1,
            explanation:
              "Position must be correct before dispatch because once a rider enters the flume and is moving, there is no safe way to stop or reposition them. The wrong position - head-first, standing or sideways - will continue unchecked through the entire ride, dramatically increasing injury risk.",
            type: "knowledge",
          },
          {
            id: "q4-3-5",
            question:
              "Two riders attempt to link arms and go down a body slide together. How should you respond?",
            options: [
              "Allow it if both riders consent and meet the height requirements",
              "Allow it only if the ride is quiet and there is no queue",
              "Stop them - linking or chaining is a listed high-risk behaviour requiring immediate intervention",
              "Allow it if they are adults, since the rule is mainly for children",
            ],
            correctIndex: 2,
            explanation:
              "Linking or chaining with other riders is one of the six high-risk behaviours listed for immediate intervention. Linked riders create an unpredictable mass that travels faster, exits at a wrong angle and significantly increases collision and injury risk.",
            type: "scenario",
          },
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
            body: "The catch pool must be completely clear - no rider in the water, no rider climbing out, no rider standing at the edge - before the exit operator signals dispatch clearance to the top. 'Almost clear' is not clear.",
          },
          {
            heading: "Top-Bottom Coordination",
            type: "text",
            body: "Dispatch operators at the top and exit operators at the bottom form a closed communication loop. The top cannot dispatch without bottom confirmation. The bottom cannot confirm until the exit zone is fully clear. If communication is lost - even momentarily - dispatch must stop until it is restored.",
          },
          {
            heading: "Blind Spots and Delays",
            type: "text",
            body: "Many slide configurations have blind spots - curves, enclosed sections or elevation changes that prevent direct visual confirmation of the full flume. In these configurations, the exit operator's signal is the only reliable information. Operators must be positioned for maximum visibility of both the exit zone and the flume section they can see.",
          },
          {
            type: "warning",
            body: "Communication system failure is an immediate shutdown trigger. If you cannot confirm exit clearance, you cannot dispatch. There is no workaround for this.",
          },
        ],
        keyTakeaways: [
          "Exit zone must be completely clear before dispatch signal",
          "Top-bottom coordination is a closed loop - both ends must participate",
          "Communication loss = immediate dispatch stop",
          "Operator positioning must maximise visibility of exit zone and flume",
        ],
        quiz: [
          {
            id: "q4-4-1",
            question:
              "A rider has exited the slide but is still standing at the edge of the catch pool. Can you signal dispatch clearance?",
            options: [
              "Yes - the rider has exited the slide itself",
              "Yes - as long as the next rider is still 10 seconds away",
              "No - the catch pool must be completely clear with no rider in the water, climbing out or standing at the edge",
              "No - but only if the next rider is a child",
            ],
            correctIndex: 2,
            explanation:
              "The catch pool must be completely clear - no rider in the water, no rider climbing out, no rider standing at the edge - before signalling dispatch clearance. 'Almost clear' is not clear.",
            type: "scenario",
          },
          {
            id: "q4-4-2",
            question:
              "Your radio communication with the top operator cuts out momentarily during peak hours. What is the correct response?",
            options: [
              "Use hand signals instead and continue dispatch",
              "Stop all dispatch immediately until communication is fully restored",
              "Wait 30 seconds to see if it comes back, then resume",
              "Send another staff member to relay messages",
            ],
            correctIndex: 1,
            explanation:
              "Communication system failure - even momentary - is an immediate shutdown trigger. Dispatch must stop until communication is fully restored. There is no workaround for this.",
            type: "scenario",
          },
          {
            id: "q4-4-3",
            question:
              "The exit operator and the top dispatch operator form a closed communication loop. What does this mean in practice?",
            options: [
              "Both operators share the same radio channel but can dispatch independently",
              "The top cannot dispatch without a clearance signal from the bottom, and the bottom cannot signal until the exit zone is fully clear",
              "One operator monitors the slide while the other handles the queue",
              "Communication is sent in one direction only - from top to bottom",
            ],
            correctIndex: 1,
            explanation:
              "The closed loop means both ends must participate in every dispatch cycle. The top operator cannot dispatch without bottom confirmation. The bottom operator cannot confirm until the exit zone is completely clear. Breaking either side of this loop requires dispatch to stop.",
            type: "knowledge",
          },
          {
            id: "q4-4-4",
            question:
              "Your slide has an enclosed mid-section that creates a blind spot. As the exit operator, what is your primary responsibility?",
            options: [
              "To walk along the outside of the enclosed section before each dispatch",
              "To be positioned for maximum visibility of the exit zone and signal clearance only when fully clear",
              "To time dispatch intervals using a stopwatch as a substitute for visual confirmation",
              "To relay rider count to the top operator so they can estimate timing",
            ],
            correctIndex: 1,
            explanation:
              "In slides with blind spots, the exit operator's signal is the only reliable confirmation of clearance. The exit operator must position themselves for maximum visibility of the exit zone. Their clearance signal carries extra weight because mid-ride visual confirmation is impossible.",
            type: "scenario",
          },
          {
            id: "q4-4-5",
            question:
              "What does completely clear mean for the catch pool before signalling dispatch clearance?",
            options: [
              "The previous rider has exited the flume into the water",
              "The previous rider is swimming toward the pool edge",
              "No rider is in the water, climbing out or standing at the edge of the catch pool",
              "The previous rider has moved at least two metres from the slide exit",
            ],
            correctIndex: 2,
            explanation:
              "Completely clear means no rider in the water, no rider climbing out and no rider standing at the edge. Almost clear is not clear. A rider still at the edge of the catch pool is still in the hazard zone and clearance cannot be signalled.",
            type: "knowledge",
          },
        ],
      },
    ],
  },
  {
    id: "defect-recognition",
    number: 6,
    title: "Defect Recognition",
    subtitle: "See It Before It Fails",
    description:
      "Learn to identify structural defects, surface damage and joint failures. This is what separates trained operators from generic staff.",
    icon: "magnifier",
    color: "#dc2626",
    badge: { icon: "magnifier", label: "Defect Spotter" },
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
            type: "diagram",
            heading: "Defect Recognition Quick Reference",
            body: "A quick-reference guide to identifying structural, surface and joint defects and their required response level.",
            diagramId: "defect-recognition",
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
            body: "Large fractures are less common but very serious. Fiberglass does not tear easily - if it has fractured, significant force was applied. Fractures are usually found on outer edges and bolting flanges, which are critical to structural integrity. Any fracture could seriously degrade the structural integrity of the slide section.",
          },
          {
            type: "critical",
            body: "All structural defects require the slide to be taken out of service immediately. There is no condition under which a cracked, punctured or fractured flume section should continue operating.",
          },
        ],
        keyTakeaways: [
          "Cracks indicate stress beyond design limits - immediate shutdown",
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
              "Do not open the slide - fractures on bolting flanges critically degrade structural integrity and require professional repair",
              "Open the slide for lighter riders only",
            ],
            correctIndex: 2,
            explanation:
              "Any fracture could seriously degrade structural integrity and must be fixed immediately. Scheduling pressure is never a valid reason to operate a structurally compromised slide.",
            type: "defect",
          },
          {
            id: "q5-1-2",
            question:
              "What does a crack in the FRP flume indicate structurally?",
            options: [
              "Normal surface wear from rider friction over time",
              "The FRP has been stressed beyond its design limits",
              "The gelcoat is separating from the surface layer",
              "Mineral buildup has hardened and split the surface",
            ],
            correctIndex: 1,
            explanation:
              "Cracks in FRP indicate the material has been stressed beyond its design limits. They are not surface wear - they are structural failures requiring immediate attention and professional repair, including fiberglass application on both sides of the damaged part.",
            type: "knowledge",
          },
          {
            id: "q5-1-3",
            question:
              "Where on the slide structure are large fractures most commonly found, and why does their location matter?",
            options: [
              "On the inner riding surface, where rider friction is highest",
              "On outer edges and bolting flanges, which are critical to structural integrity",
              "Near the base of the tower, due to vibration from the pump system",
              "In the mid-section of long runs, due to thermal stress",
            ],
            correctIndex: 1,
            explanation:
              "Large fractures are typically found on outer edges and bolting flanges. These are structurally critical locations - bolting flanges connect sections together. A fracture here could seriously degrade the integrity of the entire slide section.",
            type: "knowledge",
          },
          {
            id: "q5-1-4",
            question:
              "A puncture is discovered in the flume surface. What is the additional risk beyond the hole itself?",
            options: [
              "Riders may notice the hole and complain",
              "Water ingress through the puncture accelerates internal degradation of the FRP",
              "The hole reduces water flow efficiency across the flume",
              "Air bubbles forming at the puncture create turbulence for riders",
            ],
            correctIndex: 1,
            explanation:
              "Punctures must be repaired immediately. Beyond the surface hazard to riders, water entering through a puncture penetrates the FRP structure and accelerates internal degradation - turning a localised puncture into a larger structural problem over time.",
            type: "defect",
          },
          {
            id: "q5-1-5",
            question:
              "The repair method for cracks requires fiberglass to be applied on both sides of the damaged part. What does this imply about operator response when a crack is found?",
            options: [
              "Operators can apply a temporary surface patch and reopen the slide",
              "The slide must be taken out of service - this repair requires specialist access to both sides of the structure",
              "The crack can be monitored for a week before escalating",
              "Only cracks longer than 10 cm require full out-of-service action",
            ],
            correctIndex: 1,
            explanation:
              "The requirement for fiberglass on both sides of the damaged part means this is a professional structural repair - not a field fix. Any cracked flume section must be taken out of service immediately. There is no category of crack that permits continued operation.",
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
            body: "Surface scratches from riders, maintenance tools or debris increase local friction. Light scratches can be buffed out. Deeper scratches require filling with gelcoat putty, sanding and refinishing.",
          },
          {
            heading: "Peeling or Faded Clear Coat / Gelcoat",
            type: "text",
            body: "When the protective clear coat or gelcoat begins peeling or fading, the underlying FRP is exposed to UV, chemicals and physical wear at an accelerated rate. This requires resurfacing - not just cosmetic attention.",
          },
          {
            heading: "Mineral Buildup",
            type: "text",
            body: "White scale deposits are technically a surface defect that directly affects rider safety. They create variable-friction zones and must be treated with appropriate acid-based cleaning products, not simply scrubbed with soap.",
          },
        ],
        keyTakeaways: [
          "Chips expand through osmotic blistering if not repaired",
          "Scratches increase local friction - buff or fill depending on depth",
          "Gelcoat failure exposes FRP to accelerated degradation",
          "Mineral buildup is a surface defect with direct safety implications",
        ],
        quiz: [
          {
            id: "q5-2-1",
            question:
              "You notice a small chip in the gelcoat during an inspection. It currently looks minor. What happens if it is left unrepaired?",
            options: [
              "Nothing - small chips are cosmetic only",
              "It will self-heal from the water flow",
              "Water penetration will cause the chip to expand through osmotic blistering",
              "It will only become a problem after several years",
            ],
            correctIndex: 2,
            explanation:
              "Small chips in gelcoat expose the fiberglass beneath. If left unrepaired, water penetration causes the chip to expand through osmotic blistering, turning a minor defect into a larger problem.",
            type: "defect",
          },
          {
            id: "q5-2-2",
            question:
              "White scale deposits on the flume surface should be treated with:",
            options: [
              "Soap and water with a scrubbing brush",
              "Appropriate acid-based cleaning products",
              "High-pressure water blasting",
              "Sandpaper to remove the deposits mechanically",
            ],
            correctIndex: 1,
            explanation:
              "Mineral buildup (white scale deposits) must be treated with appropriate acid-based cleaning products, not simply scrubbed with soap. These deposits create variable-friction zones that directly affect rider safety.",
            type: "knowledge",
          },
          {
            id: "q5-2-3",
            question:
              "A section of the flume has visible gelcoat peeling. Why is this more serious than just a cosmetic issue?",
            options: [
              "Peeling gelcoat increases rider friction and slows queue throughput",
              "The underlying FRP is now exposed to UV, chemicals and physical wear at an accelerated rate",
              "Peeling gelcoat creates sharp edges that will scratch riders",
              "It indicates the slide is overdue for its annual repaint",
            ],
            correctIndex: 1,
            explanation:
              "Gelcoat is the protective layer over the FRP. When it peels, the underlying fiberglass is exposed to UV radiation, pool chemicals and physical wear without protection. Degradation accelerates significantly - this is a maintenance issue, not just a cosmetic one.",
            type: "defect",
          },
          {
            id: "q5-2-4",
            question:
              "What is the difference in treatment between light scratches and deeper scratches on the flume surface?",
            options: [
              "Both are treated the same way with gelcoat putty",
              "Light scratches can be buffed out; deeper scratches require filling with gelcoat putty, sanding and refinishing",
              "Light scratches require immediate shutdown; deeper scratches are monitored",
              "Deeper scratches are buffed more aggressively; light scratches are ignored",
            ],
            correctIndex: 1,
            explanation:
              "The depth of a scratch determines the repair approach. Light scratches increase local friction but can be buffed out. Deeper scratches need to be filled with gelcoat putty, then sanded and refinished to restore a smooth, safe riding surface.",
            type: "knowledge",
          },
          {
            id: "q5-2-5",
            question:
              "Why do mineral deposits (white scale) have a direct safety impact beyond their appearance?",
            options: [
              "They reduce the visual appeal of the slide, which affects rider confidence",
              "They create variable-friction zones that alter rider speed unpredictably",
              "They indicate the water is too warm for safe operation",
              "They block nozzles from delivering water to the catch pool",
            ],
            correctIndex: 1,
            explanation:
              "Mineral buildup creates variable-friction zones on the riding surface. These zones cause riders to decelerate unpredictably at different points in the flume, making consistent dispatch timing impossible and increasing the risk of riders stopping mid-slide or arriving at the exit faster or slower than expected.",
            type: "defect",
          },
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
            body: "Joint sealant deteriorates over time from UV exposure, chemical contact and thermal cycling. When it fails, the joint opens - creating a lip or gap that catches riders.",
          },
          {
            heading: "What NOT to Do with Joints",
            type: "checklist",
            body: "Critical joint maintenance rules:",
            items: [
              "DO NOT use plastic filler that will harden - joints must remain flexible",
              "DO NOT pour lacquer thinner directly onto a joint - it dissolves the sealant",
              "DO NOT put fiberglass over joints - glassed-over joints that crack leave jagged edges that can injure riders",
              "DO NOT leave old filler in place when refilling - remove all old material first",
            ],
          },
          {
            type: "oem-reference",
            body: "Fiberglass sections move with temperature changes, so joints between sections must be filled with a flexible adhesive sealant (as specified by the manufacturer). The sealant should be applied from bottom to top, ensuring no air pockets are trapped beneath the surface.",
          },
        ],
        keyTakeaways: [
          "Joints must be flexible - hard fillers cause cracking and rider injury",
          "Sealant deterioration creates lips and gaps that catch riders",
          "Never fibreglass over joints - cracked glass creates cutting edges",
          "Joint refilling requires complete removal of old material first",
        ],
        quiz: [
          {
            id: "q5-3-1",
            question:
              "A maintenance worker suggests applying fiberglass over a deteriorating joint to strengthen it. Is this correct?",
            options: [
              "Yes - fiberglass adds structural reinforcement",
              "No - fiberglass over joints will crack due to thermal movement, creating jagged edges that can injure riders",
              "Yes - but only as a temporary fix",
              "It depends on the type of fiberglass used",
            ],
            correctIndex: 1,
            explanation:
              "Fiberglass must never be applied over joints. Joints must flex with thermal expansion and contraction. Glassed-over joints that crack leave jagged edges that can seriously injure riders.",
            type: "defect",
          },
          {
            id: "q5-3-2",
            question:
              "When refilling a deteriorated joint with new sealant, what must be done first?",
            options: [
              "Apply new sealant directly over the old material",
              "Clean the surface with lacquer thinner to prepare it",
              "Remove all old filler material completely before applying new sealant",
              "Sand down the old sealant until smooth",
            ],
            correctIndex: 2,
            explanation:
              "All old filler must be completely removed before refilling. New sealant applied over deteriorated old material will not bond properly and will fail prematurely. Lacquer thinner must never be poured directly onto joints as it dissolves the sealant.",
            type: "knowledge",
          },
          {
            id: "q5-3-3",
            question:
              "What causes joint sealant to deteriorate over time?",
            options: [
              "Rider weight pressing on joints during operation",
              "UV exposure, chemical contact and thermal cycling",
              "High water pressure from the hydraulic system",
              "Insufficient maintenance team staffing",
            ],
            correctIndex: 1,
            explanation:
              "Joint sealant deteriorates from UV exposure, chemical contact from pool water and the constant thermal cycling as the fiberglass sections expand and contract with temperature changes. When it fails, the joint opens and creates a catching hazard.",
            type: "knowledge",
          },
          {
            id: "q5-3-4",
            question:
              "What happens when a joint sealant fails and the joint opens?",
            options: [
              "The flume sections separate slightly but this does not affect riders",
              "A lip or gap forms that can catch riders passing over it",
              "Water leaks from the joint, reducing flow rate",
              "The joint expands smoothly and self-seals over time",
            ],
            correctIndex: 1,
            explanation:
              "When joint sealant fails and the joint opens, it creates a lip or gap in what should be a smooth continuous riding surface. Riders traveling at speed can catch this edge, resulting in serious injury. This is why joint condition is a critical inspection item.",
            type: "defect",
          },
          {
            id: "q5-3-5",
            question:
              "Why must joint fill be applied from bottom to top with no air pockets covered over?",
            options: [
              "Air pockets cause the sealant to cure faster than intended",
              "Air pockets covered by sealant create voids that will compress under load and cause the joint to fail prematurely",
              "Bottom-to-top application ensures even colour coverage",
              "It is a procedural requirement with no structural reason",
            ],
            correctIndex: 1,
            explanation:
              "As a fundamental principle, joint fills must go from bottom to top with no air pockets covered over. Air voids beneath the sealant surface will compress and collapse under load - leading to premature joint failure and recreating the lip or gap hazard the repair was meant to fix.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "5-4",
        title: "What Operators Should Do",
        duration: "8 min",
        content: [
          {
            type: "text",
            body: "Operators are the first line of detection. Your role is not to repair defects - it is to identify them, assess their severity and take the correct immediate action.",
          },
          {
            heading: "The Three-Step Response",
            type: "checklist",
            body: "For any defect identified:",
            items: [
              "REPORT - Document the defect immediately with location, type, size and photographs where possible",
              "ASSESS - Determine if the defect requires immediate shutdown or can be monitored during operation",
              "ESCALATE - Contact maintenance team, supervisor or manufacturer depending on severity",
            ],
          },
          {
            heading: "Shutdown vs Monitor Decision",
            type: "text",
            body: "Any structural defect (crack, puncture, fracture) = immediate shutdown. Surface defects (chips, scratches, minor scaling) = document and schedule maintenance. Joint issues = assess severity: minor sealant wear is monitored; any lip, gap or sharp edge requires immediate shutdown. When in doubt, shut down. You will never be criticised for being too cautious with safety.",
          },
        ],
        keyTakeaways: [
          "Three-step response: Report, Assess, Escalate",
          "Structural defects = always shutdown",
          "Surface defects = document and schedule",
          "Joint issues = assess severity; any lip or sharp edge = shutdown",
        ],
        quiz: [
          {
            id: "q5-4-1",
            question:
              "You find a joint with minor sealant wear but no lip or gap. What is the correct action?",
            options: [
              "Shut the slide immediately",
              "Document the wear, schedule maintenance and monitor during operation",
              "Ignore it - sealant wear is normal",
              "Attempt to repair it yourself between riders",
            ],
            correctIndex: 1,
            explanation:
              "Minor sealant wear without a lip or sharp edge can be monitored during operation. Document it and schedule maintenance. However, any lip, gap or sharp edge requires immediate shutdown.",
            type: "scenario",
          },
          {
            id: "q5-4-2",
            question:
              "What are the three steps of the operator defect response framework?",
            options: [
              "Fix, Test, Resume",
              "Report, Assess, Escalate",
              "Observe, Ignore, Report",
              "Shutdown, Repair, Reopen",
            ],
            correctIndex: 1,
            explanation:
              "The three-step response is Report (document with location, type, size, photos), Assess (determine if immediate shutdown or monitored operation) and Escalate (contact appropriate personnel based on severity).",
            type: "knowledge",
          },
          {
            id: "q5-4-3",
            question:
              "You find a small chip in the gelcoat during a morning inspection. The slide is otherwise in good condition. What is the correct classification and action?",
            options: [
              "Structural defect - immediate shutdown required",
              "Surface defect - document and schedule maintenance, monitor during operation",
              "Joint issue - assess for lip or gap before deciding",
              "Not a defect - chips are normal surface wear",
            ],
            correctIndex: 1,
            explanation:
              "A gelcoat chip is a surface defect. Per the shutdown vs monitor decision framework, surface defects (chips, scratches, minor scaling) should be documented and scheduled for maintenance. They do not require immediate shutdown unless they have escalated to affect the FRP structure.",
            type: "scenario",
          },
          {
            id: "q5-4-4",
            question:
              "A joint inspection reveals a small but definite lip at one section connection. What is the correct response?",
            options: [
              "Document and monitor - minor joint issues do not require shutdown",
              "Apply temporary tape over the lip and review at end of day",
              "Shut down immediately - any lip or sharp edge at a joint requires immediate removal from service",
              "Reduce dispatch intervals as a precaution and continue operating",
            ],
            correctIndex: 2,
            explanation:
              "The defect response framework is clear: joint issues with a lip, gap or sharp edge require immediate shutdown. Minor sealant wear without a lip can be monitored, but any catching hazard must be addressed before the slide can operate.",
            type: "scenario",
          },
          {
            id: "q5-4-5",
            question:
              "When documenting a defect, what information should be included in the report?",
            options: [
              "The defect type and the name of the operator who found it",
              "Location, type, size and photographs where possible",
              "The estimated repair cost and preferred maintenance contractor",
              "The date only - other details are added by the maintenance team",
            ],
            correctIndex: 1,
            explanation:
              "The Report step of the three-step response requires documenting the defect with its location, type, size and photographs where possible. This information is essential for the maintenance team to assess severity, order materials and prioritise repair work.",
            type: "knowledge",
          },
        ],
      },
    ],
  },
  {
    id: "water-quality",
    number: 7,
    title: "Water Quality and Performance",
    subtitle: "The Invisible Safety Factor",
    description:
      "Understand how water chemistry affects slide materials, rider safety and long-term equipment integrity. The connection most training programs miss.",
    icon: "droplet",
    color: "#0284c7",
    badge: { icon: "droplet", label: "Water Quality Certified" },
    lessons: [
      {
        id: "6-1",
        title: "Why Water Quality Matters",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Water quality is not just a public health concern - it directly affects the physical condition of the slide materials, the performance of the ride and the safety of every rider. This is the connection most training programs completely miss.",
          },
          {
            type: "oem-reference",
            body: "Water quality measurements, including LSI and FAC levels, must be recorded at least monthly by qualified personnel in line with local regulations. These records must be kept on file and may be requested by the manufacturer in relation to warranty claims.",
          },
          {
            type: "diagram",
            heading: "Water Chemistry Balance Parameters",
            body: "The key water chemistry parameters, their target ranges and the risks associated with values above or below those ranges.",
            diagramId: "water-chemistry",
          },
          {
            heading: "Langelier Saturation Index (LSI)",
            type: "text",
            body: "The LSI measures water's tendency to deposit or dissolve calcium carbonate. Negative LSI means corrosive water that attacks metal and FRP. Positive LSI means scaling water that deposits minerals on surfaces. Both extremes damage equipment and create safety issues. The target is a balanced LSI near zero.",
          },
          {
            heading: "Free Available Chlorine (FAC)",
            type: "text",
            body: "FAC is the active disinfectant in pool water. Too low = health risk. Too high = accelerated degradation of FRP gelcoat, rubber seals and metal components. Indoor facilities typically target 1.0-3.0 ppm, while outdoor facilities require a higher minimum of 2.0-4.0 ppm due to UV degradation of chlorine from sunlight. Maintaining FAC within manufacturer-specified limits protects both rider health and equipment integrity.",
          },
          {
            type: "case-study",
            heading: "Real-World Example - Water Quality Failure",
            body: "An aquatic facility experienced multiple visitor illness cases linked to inadequate water treatment in interactive water features. Insufficient chlorination levels and inadequate monitoring during high-bather-load periods allowed pathogens to reach unsafe levels. Automated chemical monitoring systems, frequent manual water quality checks during peak periods and proper staff training on water chemistry protocols could have prevented the outbreak.",
            source: "Based on CDC Aquatic Health Code incident reports",
          },
        ],
        keyTakeaways: [
          "Water quality directly affects slide materials, performance and rider safety",
          "LSI measures scaling vs corrosion tendency - target is near zero",
          "FAC outside limits degrades equipment and creates health or safety risks",
          "Monthly water quality records are mandatory and may be required for warranty claims",
        ],
        quiz: [
          {
            id: "q6-1-1",
            question:
              "What does the Langelier Saturation Index (LSI) measure?",
            options: [
              "The chlorine level in the water",
              "The water's tendency to deposit or dissolve calcium carbonate",
              "The pH level only",
              "The biological contamination level",
            ],
            correctIndex: 1,
            explanation:
              "The LSI measures water's tendency to deposit (positive LSI = scaling) or dissolve (negative LSI = corrosive) calcium carbonate. Both extremes damage equipment and create safety issues. The target is near zero.",
            type: "knowledge",
          },
          {
            id: "q6-1-2",
            question:
              "Why must water quality measurements be documented monthly?",
            options: [
              "For marketing purposes only",
              "Because local council requires daily reports",
              "They are required for warranty claims and regulatory compliance",
              "They are optional but recommended",
            ],
            correctIndex: 2,
            explanation:
              "LSI and FAC levels must be recorded monthly by qualified personnel. These records must be maintained and may be requested by the manufacturer for warranty claims.",
            type: "knowledge",
          },
          {
            id: "q6-1-3",
            question:
              "What happens to metal components and FRP when the LSI is significantly negative?",
            options: [
              "Calcium deposits build up on all metal surfaces",
              "The water becomes corrosive, attacking metal structures, pump housings and FRP gelcoat",
              "Chlorine becomes less effective at disinfecting the water",
              "Rider speed increases due to reduced surface tension",
            ],
            correctIndex: 1,
            explanation:
              "A negative LSI means the water is corrosive - it actively dissolves calcium carbonate and attacks metal and FRP surfaces. This corrodes structural steel, pump housings and fasteners, and can strip the gelcoat from FRP sections over time.",
            type: "knowledge",
          },
          {
            id: "q6-1-4",
            question:
              "High Free Available Chlorine (FAC) levels - above the manufacturer's specified limits - can cause which type of damage?",
            options: [
              "Increased mineral scaling on flume surfaces",
              "Accelerated degradation of FRP gelcoat, rubber seals and metal components",
              "Decreased water flow rate through the hydraulic system",
              "Discolouration of the water without any structural damage",
            ],
            correctIndex: 1,
            explanation:
              "While low FAC is a health risk, high FAC causes equipment damage. Excessive chlorine accelerates degradation of FRP gelcoat, rubber seals and metal components. This is why FAC must stay within the manufacturer's specified range - not just above a minimum.",
            type: "knowledge",
          },
          {
            id: "q6-1-5",
            question:
              "What is the target value for the Langelier Saturation Index (LSI) and why?",
            options: [
              "As high as possible to prevent corrosion",
              "As low as possible to prevent scaling",
              "Near zero, because both extremes - scaling and corrosion - damage equipment",
              "Between 2 and 3, which is the optimal disinfection range",
            ],
            correctIndex: 2,
            explanation:
              "The LSI target is near zero. A positive LSI causes scaling (mineral deposits on surfaces). A negative LSI causes corrosion (attacking metals and FRP). Both extremes damage equipment and create safety issues, so balanced water near zero is the operational goal.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "6-2",
        title: "Operational Impacts of Poor Water Quality",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Poor water quality manifests as visible and measurable changes to the slide system. Operators who understand these signs can identify water quality issues through routine observation - before they cause incidents.",
          },
          {
            heading: "Scaling",
            type: "text",
            body: "High-LSI water deposits calcium and mineral scale on all wetted surfaces. On the flume, this creates the rough, white deposits that alter rider speed. On pumps and nozzles, it reduces flow capacity. On metal structures, it can mask corrosion developing underneath.",
          },
          {
            heading: "Corrosion",
            type: "text",
            body: "Low-LSI water is aggressive toward metals and can attack FRP gelcoat. Corrosion weakens structural steel, pump housings and fasteners. The combination of chlorine and low-LSI water is particularly destructive.",
          },
          {
            heading: "Staining and Discolouration",
            type: "text",
            body: "Iron and manganese in the water cause rust-coloured or dark staining on FRP surfaces. While primarily cosmetic, heavy staining indicates water chemistry issues that are simultaneously damaging equipment in less visible ways.",
          },
        ],
        keyTakeaways: [
          "Scaling reduces rider safety and equipment efficiency",
          "Corrosive water attacks metals, FRP and fasteners",
          "Visible staining indicates underlying water chemistry problems",
          "Operators should report changes in surface appearance as potential water quality indicators",
        ],
        quiz: [
          {
            id: "q6-2-1",
            question:
              "You notice rough white deposits forming on the flume surface. What does this indicate?",
            options: [
              "Normal wear from rider friction",
              "High-LSI water depositing calcium and mineral scale",
              "The gelcoat is fading from UV exposure",
              "Chemical residue from cleaning products",
            ],
            correctIndex: 1,
            explanation:
              "White scale deposits on wetted surfaces indicate high-LSI (scaling) water. On the flume, these deposits alter rider speed. On pumps and nozzles, they reduce flow capacity. This is a water quality issue, not a surface wear issue.",
            type: "defect",
          },
          {
            id: "q6-2-2",
            question:
              "Which combination of water chemistry conditions is described as 'particularly destructive' to equipment?",
            options: [
              "High pH and high temperature",
              "Chlorine combined with low-LSI (corrosive) water",
              "High calcium and low chlorine",
              "Warm water with high turbidity",
            ],
            correctIndex: 1,
            explanation:
              "The combination of chlorine and low-LSI (corrosive) water is particularly destructive. Low-LSI water is aggressive toward metals and can attack FRP gelcoat, and chlorine amplifies this effect.",
            type: "knowledge",
          },
          {
            id: "q6-2-3",
            question:
              "Scaling deposits on pumps and nozzles have what operational effect?",
            options: [
              "They increase water pressure by narrowing pipe diameter",
              "They reduce flow capacity, affecting the water delivery the hydraulic system depends on",
              "They improve filter performance by trapping fine particles",
              "They have no operational effect - scaling only affects visible surfaces",
            ],
            correctIndex: 1,
            explanation:
              "Calcium and mineral scale on pumps and nozzles reduces their flow capacity. The hydraulic system depends on correct flow to maintain safe rider speeds and consistent surface lubrication. Reduced flow affects dispatch timing reliability and creates the dry spots that contribute to incidents.",
            type: "knowledge",
          },
          {
            id: "q6-2-4",
            question:
              "Rust-coloured staining appears on FRP flume sections. What does this indicate beyond the visible discolouration?",
            options: [
              "The gelcoat has reached end of life and needs repainting",
              "Iron or manganese in the water is causing staining, indicating underlying water chemistry problems that are simultaneously damaging equipment",
              "A rider with rusty equipment has contaminated the surface",
              "The slide has been exposed to rain water which has a different chemistry",
            ],
            correctIndex: 1,
            explanation:
              "Rust-coloured or dark staining is caused by iron and manganese in the water. While primarily cosmetic on the surface, heavy staining is a visible indicator of water chemistry problems that are simultaneously causing less visible damage to metal components, seals and structural fasteners.",
            type: "defect",
          },
          {
            id: "q6-2-5",
            question:
              "Scaling deposits can mask corrosion developing underneath metal structures. Why is this an inspection challenge?",
            options: [
              "Corrosion inspections can only be performed when the slide is fully disassembled",
              "The visible scale looks similar to normal surface deposits, giving a false impression of a clean surface beneath",
              "Corrosion under scale is too small to be detected without laboratory equipment",
              "Metal structures are below water level and cannot be inspected during operation",
            ],
            correctIndex: 1,
            explanation:
              "Scale deposits on metal create a deceptive surface - they look like a buildup problem but can be hiding active corrosion underneath. This is why water chemistry must be kept balanced: it prevents scale from forming in the first place, keeping metal surfaces inspectable and preventing hidden structural deterioration.",
            type: "scenario",
          },
        ],
      },
      {
        id: "6-3",
        title: "What Operators Need to Monitor",
        duration: "8 min",
        content: [
          {
            type: "text",
            body: "Facility staff share responsibility for water chemistry management and are the most frequent observers of its effects. Knowing what to look for, when to test and when to escalate is a critical operational skill.",
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
            body: "Water quality must also be retested following any pool shock treatment, confirming levels are back within acceptable limits before the ride is reopened.",
          },
        ],
        keyTakeaways: [
          "Operators are the first to see water quality effects - observation is a key skill",
          "Seven visual indicators should trigger a report to maintenance",
          "After pool shock treatments, water quality must be confirmed before reopening",
          "Escalation is the correct response - operators report, specialists treat",
        ],
        quiz: [
          {
            id: "q6-3-1",
            question:
              "The catch pool water appears cloudy and several riders have reported eye irritation today. What should you do?",
            options: [
              "Continue operating - some eye irritation is normal with chlorinated water",
              "Report the observations to maintenance as potential water quality indicators and await guidance",
              "Add more chlorine to the system yourself",
              "Reduce operating hours to limit exposure",
            ],
            correctIndex: 1,
            explanation:
              "Cloudy water and increased rider irritation are visual indicators of water quality issues. Operators should report to maintenance - specialists treat the issue, operators do not adjust water chemistry themselves.",
            type: "scenario",
          },
          {
            id: "q6-3-2",
            question:
              "After a pool shock treatment, when can the ride return to operation?",
            options: [
              "Immediately after the treatment is applied",
              "After 24 hours regardless of water quality readings",
              "Only after water quality measurements confirm levels are within correct limits",
              "After the water looks clear again",
            ],
            correctIndex: 2,
            explanation:
              "Water quality measurements are required after any pool shock treatment to confirm levels are within correct limits before the ride returns to operation. Visual clarity alone is not sufficient.",
            type: "knowledge",
          },
          {
            id: "q6-3-3",
            question:
              "You notice the nozzle spray pattern at the top of the flume has changed - some nozzles appear to have reduced output. What should you do?",
            options: [
              "Adjust the water pressure yourself to compensate",
              "Ignore it if the overall water flow looks acceptable",
              "Report it to maintenance as a potential mineral blockage indicator",
              "Close the slide until a technician inspects the hydraulic system",
            ],
            correctIndex: 2,
            explanation:
              "Reduced nozzle performance or changed spray patterns are listed as visual water quality indicators to report to maintenance. Mineral blockage from scaling water is a common cause. Operators report - they do not adjust water systems themselves.",
            type: "scenario",
          },
          {
            id: "q6-3-4",
            question:
              "Slimy or unusually slippery surfaces on the slide platform or flume entry could indicate what water quality issue?",
            options: [
              "Excessive FAC causing the gelcoat to become soft",
              "Algae or biofilm growth - a sign of insufficient disinfection",
              "High-LSI water depositing a calcium film on the surface",
              "Overspray from the hydraulic nozzles creating wet spots",
            ],
            correctIndex: 1,
            explanation:
              "Slimy or unusually slippery surfaces indicate potential algae or biofilm growth. This is listed as a visual indicator to report to maintenance and is a sign that FAC levels may be insufficient to maintain adequate disinfection. It is both a health concern and a slip hazard.",
            type: "defect",
          },
          {
            id: "q6-3-5",
            question:
              "An operator notices white scale appearing on flume surfaces more rapidly than usual between cleaning cycles. What is the appropriate action?",
            options: [
              "Increase cleaning frequency and continue normal operations",
              "Report the accelerated scaling to maintenance as a potential water chemistry indicator",
              "Apply acid-based cleaner immediately without informing maintenance",
              "Accept it as normal seasonal variation and note it in the logbook only",
            ],
            correctIndex: 1,
            explanation:
              "White scale appearing faster than usual between cleaning cycles is a visual indicator that should be reported to maintenance. Accelerated scaling suggests the LSI has shifted positive - a water chemistry issue that maintenance and water quality specialists need to assess and correct.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "incident-prevention",
    number: 8,
    title: "Incident Prevention",
    subtitle: "Stop It Before It Happens",
    description:
      "Scenario-based training built from real incident patterns. Learn to recognise early warning signs and intervene before situations escalate.",
    icon: "shield",
    color: "#e11d48",
    badge: { icon: "shield", label: "Prevention Specialist" },
    lessons: [
      {
        id: "7-1",
        title: "Collision Scenario - Late Dispatch",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "This is the most common waterslide incident pattern. Understanding the chain of events that leads to collision allows you to break the chain at multiple points.",
          },
          {
            type: "diagram",
            heading: "Incident Chain and Intervention Points",
            body: "The chain of contributing factors that leads to a collision incident and the points where intervention can break the chain.",
            diagramId: "incident-chain",
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
              "Never rely on fixed intervals alone - assess real-time conditions",
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
        quiz: [
          {
            id: "q7-1-1",
            question:
              "In the late dispatch collision scenario, a child is followed by an adult at a standard 15-second interval. What was the primary failure?",
            options: [
              "The child should not have been allowed to ride",
              "The dispatch interval was not adjusted for the weight difference between riders",
              "The adult was dispatched too slowly",
              "The slide should have been closed due to the age difference",
            ],
            correctIndex: 1,
            explanation:
              "The primary failure was applying a standard fixed interval without adjusting for the weight difference. The lighter child travels slower, the heavier adult travels faster, and with mineral buildup causing further deceleration, the gap closes rapidly.",
            type: "scenario",
          },
          {
            id: "q7-1-2",
            question:
              "Why do enclosed slides require more conservative dispatch timing?",
            options: [
              "They are usually steeper",
              "Operators have zero mid-ride visibility so cannot see developing problems",
              "Water flow is less reliable in enclosed slides",
              "Riders go faster in enclosed slides",
            ],
            correctIndex: 1,
            explanation:
              "Enclosed slide configurations prevent direct visual confirmation of the full flume. Neither operator can see what is happening mid-ride, so problems like a slowed or stopped rider are invisible until the exit. More conservative timing compensates for this lack of visibility.",
            type: "knowledge",
          },
          {
            id: "q7-1-3",
            question:
              "Mineral buildup on the flume surface contributed to the collision scenario in this lesson. How does it affect the risk calculation?",
            options: [
              "It only matters in open slides where it is visible",
              "It has no meaningful effect on rider speed",
              "It causes deceleration in lighter, slower riders, narrowing the gap with heavier riders behind them",
              "It affects all riders equally so the interval does not need adjusting",
            ],
            correctIndex: 2,
            explanation:
              "Mineral buildup causes uneven deceleration - lighter riders travelling slower are more affected, which narrows the gap to heavier riders dispatched behind them. Surface condition must be factored into every dispatch decision, not just noted and ignored.",
            type: "knowledge",
          },
          {
            id: "q7-1-4",
            question:
              "Which of the following best describes the 'chain of events' model for collision prevention?",
            options: [
              "Incidents are caused by a single critical failure that must be identified and fixed",
              "Multiple contributing factors combine, and breaking any one of them prevents the incident",
              "Only the dispatching operator can prevent collisions",
              "Collisions are unpredictable and cannot be systematically prevented",
            ],
            correctIndex: 1,
            explanation:
              "The chain model means multiple failures combine to cause an incident: weight difference, surface condition, fixed timing and zero visibility all contributed. Breaking the chain at any single point - adjusting interval for weight, factoring surface condition or using conservative timing for enclosed slides - can prevent the outcome.",
            type: "knowledge",
          },
          {
            id: "q7-1-5",
            question:
              "An operator applies the standard 15-second dispatch interval without considering rider weight or current surface condition. Which category of failure does this represent?",
            options: [
              "Equipment failure - the slide timer is faulty",
              "Procedural failure - using a fixed rule instead of a risk-based assessment",
              "Communication failure - operators did not coordinate",
              "Structural failure - the flume is not designed for varied rider weights",
            ],
            correctIndex: 1,
            explanation:
              "Applying a fixed interval without assessing real-time conditions (rider weight difference, surface condition) is a procedural failure. The lesson is explicit: never rely on fixed intervals alone - assess real-time conditions for every dispatch.",
            type: "defect",
          },
        ],
      },
      {
        id: "7-2",
        title: "Non-Compliant Rider Scenario",
        duration: "10 min",
        content: [
          {
            type: "text",
            body: "Non-compliant riders are an escalation management challenge. The operator must balance guest experience with absolute safety requirements - and safety always wins.",
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
              "First non-compliance - clear, firm instruction with reason: 'You must go feet-first. This prevents head and spinal injuries.'",
              "Compliance after instruction - proceed with dispatch, remain alert for the group",
              "Second non-compliance (different rider, same group) - halt dispatch for the group. Explain the ride will not operate until all members comply.",
              "Continued non-compliance - remove the group from the ride. Contact supervisor if confrontation escalates.",
              "Aggressive or threatening behaviour - activate security protocols. Do not engage in argument.",
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
          "Reasons strengthen instructions - explain the 'why' behind the rule",
          "Aggressive behaviour = security protocols, not operator confrontation",
        ],
        quiz: [
          {
            id: "q7-2-1",
            question:
              "A group of teenagers are not following instructions. The first rider complied after correction, but a second rider in the same group attempts to go standing. What do you do?",
            options: [
              "Correct only the individual rider and continue dispatching the group",
              "Halt dispatch for the entire group and explain the ride will not operate until all members comply",
              "Let them go - teenagers are always difficult",
              "Immediately call security",
            ],
            correctIndex: 1,
            explanation:
              "Second non-compliance from the same group requires halting dispatch for the group. Explain the ride will not operate until all members comply. Security is only escalated if behaviour becomes aggressive or threatening.",
            type: "scenario",
          },
          {
            id: "q7-2-2",
            question:
              "A non-compliant rider becomes verbally aggressive when asked to follow positioning rules. The queue behind is growing. What is the correct action?",
            options: [
              "Compromise on the rules to de-escalate the situation",
              "Argue back firmly to assert authority",
              "Activate security protocols - do not engage in argument",
              "Let the rider go to clear the queue and deal with it afterward",
            ],
            correctIndex: 2,
            explanation:
              "Aggressive or threatening behaviour triggers security protocols. Operators should not engage in argument. Queue pressure is irrelevant - other guests are safer with a delayed dispatch than with a non-compliant rider in the system.",
            type: "scenario",
          },
          {
            id: "q7-2-3",
            question:
              "Why does the lesson recommend explaining the reason behind a safety rule when correcting a rider?",
            options: [
              "It wastes time and is unnecessary - riders just need to comply",
              "Reasons strengthen instructions and improve compliance by connecting the rule to the real risk",
              "It shifts legal liability to the rider if they choose to ignore the warning",
              "It is required by law in all aquatic facility environments",
            ],
            correctIndex: 1,
            explanation:
              "Explaining the 'why' behind a rule - for example, 'you must go feet-first to prevent head and spinal injuries' - strengthens the instruction and improves voluntary compliance. It treats the rider as a person capable of understanding the risk, not just a rule-follower.",
            type: "knowledge",
          },
          {
            id: "q7-2-4",
            question:
              "You are operating a busy slide alone when a rider in a group of four refuses to comply with the feet-first rule after two instructions. The group becomes hostile. What is your next step?",
            options: [
              "Give one more warning and then allow the rider to go to avoid further confrontation",
              "Remove the group from the ride and contact a supervisor if confrontation escalates",
              "Allow only the non-compliant rider to go while holding back the rest of the group",
              "Close the slide for all riders until the group leaves the queue",
            ],
            correctIndex: 1,
            explanation:
              "Continued non-compliance requires removing the group from the ride. If confrontation escalates, contact a supervisor. Operators should not engage in argument, and safety requirements are never negotiated based on pressure or hostility.",
            type: "scenario",
          },
          {
            id: "q7-2-5",
            question:
              "In the non-compliant rider scenario, a growing queue is creating visible guest frustration. How should this affect the operator's safety decisions?",
            options: [
              "The operator should speed up processing to reduce tension",
              "Queue pressure is a valid reason to allow minor rule deviations",
              "Queue pressure is irrelevant to safety decisions - it is a management problem, not a safety compromise",
              "The operator should ask the queue to wait and call for a supervisor before taking any action",
            ],
            correctIndex: 2,
            explanation:
              "Queue pressure is explicitly identified as irrelevant to safety decisions. Other guests in the queue are safer with a delayed dispatch than with a non-compliant rider in the system. Queue length and guest frustration are management problems.",
            type: "scenario",
          },
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
              "STOP all dispatch immediately - signal the top operator",
              "Do NOT send anyone into the slide to check",
              "Attempt verbal communication at entry and exit points",
              "If the slide has viewing windows or access panels, use them",
              "If the rider does not emerge within the emergency timeframe, activate rescue protocol",
              "The second rider may have already impacted - treat as a potential injury event",
            ],
          },
          {
            type: "critical",
            body: "The instinct to 'send someone in to help' is extremely dangerous. A rescue rider entering a blocked slide creates a second impact. Rescue must be performed through access panels or by trained personnel following the site emergency plan.",
          },
        ],
        keyTakeaways: [
          "Stop all dispatch immediately when a blockage is suspected",
          "Never send another rider in to 'check' - this causes secondary impacts",
          "Non-arrival within expected timeframe is a blockage indicator",
          "Rescue through access panels by trained personnel only",
        ],
        quiz: [
          {
            id: "q7-3-1",
            question:
              "A dispatched rider has not arrived at the exit within the expected timeframe. A second rider was dispatched 15 seconds after the first. What is your immediate action?",
            options: [
              "Send a staff member into the slide to check",
              "Wait another 30 seconds before acting",
              "Stop all dispatch immediately and signal the top operator",
              "Increase water flow to push the stuck rider through",
            ],
            correctIndex: 2,
            explanation:
              "Stop all dispatch immediately. The second rider may have already impacted the first. Never send anyone into the slide to check - a rescue rider entering a blocked slide creates a second impact. Rescue must be performed through access panels by trained personnel.",
            type: "scenario",
          },
          {
            id: "q7-3-2",
            question:
              "Why is sending someone into the slide to help a stopped rider extremely dangerous?",
            options: [
              "The rescue person might get lost in an enclosed slide",
              "A rescue rider entering a blocked slide creates a second impact on the stopped rider",
              "It takes too long to be effective",
              "Only lifeguards are allowed in the slide",
            ],
            correctIndex: 1,
            explanation:
              "Sending a person into a blocked slide creates a second impact. The rescue person will travel at speed and collide with the stopped rider, causing additional injuries. Rescue must be through access panels or by trained personnel following the emergency plan.",
            type: "knowledge",
          },
          {
            id: "q7-3-3",
            question:
              "At what point does a non-arrival at the exit become a blockage indicator requiring emergency action?",
            options: [
              "Only after the rider has been missing for more than 5 minutes",
              "When the rider has not arrived within the expected timeframe and a second rider has already been dispatched",
              "Only if the exit operator physically confirms there is no one in the catch pool",
              "After calling the top operator three times without response",
            ],
            correctIndex: 1,
            explanation:
              "Non-arrival within the expected timeframe is a blockage indicator, especially when a second rider has already been dispatched. The combination of a potential stopped rider and a dispatched rider behind them creates a high-risk collision scenario requiring immediate action.",
            type: "scenario",
          },
          {
            id: "q7-3-4",
            question:
              "The lesson describes access panels as the correct means of conducting a rescue check. Why is this approach safer than entering the slide from the top?",
            options: [
              "Access panels are closer to where blockages typically occur",
              "They allow trained personnel to check on the stopped rider without creating a second moving object in the flume",
              "Access panels have automatic sensors that can detect a stopped rider",
              "It is faster than sending someone from the top station",
            ],
            correctIndex: 1,
            explanation:
              "Using access panels allows trained personnel to check on the rider's condition and location without entering the flume as a moving object. Entering from the top creates a second rider traveling at speed toward the stopped person, compounding the injury risk significantly.",
            type: "knowledge",
          },
          {
            id: "q7-3-5",
            question:
              "The top operator does not respond to your signal after you suspect a blockage. What should you do?",
            options: [
              "Wait for the top operator to respond before taking any further action",
              "Send a rider down to check if the slide is clear",
              "Attempt communication at both entry and exit points, and if the rider does not emerge within the emergency timeframe, activate rescue protocol",
              "Increase water flow to try to dislodge the stopped rider",
            ],
            correctIndex: 2,
            explanation:
              "Communication failure does not pause the emergency protocol. Attempt verbal communication at entry and exit points. If the rider does not emerge within the emergency timeframe, activate rescue protocol regardless of whether you have reached the top operator.",
            type: "scenario",
          },
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
              "Queue length and guest frustration are management problems - not safety compromises",
              "Surface condition (4 months without waxing) means intervals should be INCREASED, not decreased",
              "Supervisor requests to reduce intervals should be responded to with the current risk assessment",
              "If fatigue or distraction is affecting your performance, request rotation - don't push through",
              "Document any pressure to compromise safety controls",
            ],
          },
          {
            type: "warning",
            body: "The highest-risk period for waterslide incidents is peak attendance on hot days - the exact time when pressure to reduce intervals is strongest. This is not coincidence. Maintaining controls under this pressure is the single most important operational skill.",
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
              "Comply with the supervisor's instruction - they outrank you",
              "Explain the surface condition and recommend maintaining or increasing intervals, then document the exchange",
              "Ignore the supervisor and continue as normal without responding",
            ],
            correctIndex: 2,
            explanation:
              "The correct response is to communicate the risk assessment (poor surface condition requires maintaining or increasing intervals) and document the exchange. Safety controls are not subject to hierarchy override.",
            type: "scenario",
          },
          {
            id: "q7-4-2",
            question:
              "Why is peak attendance on hot days statistically the highest-risk period for waterslide incidents?",
            options: [
              "Slides deteriorate faster in heat, causing structural failures",
              "More riders are in the system and the pressure to reduce safety intervals is at its strongest - these factors combine",
              "Water temperature affects rider buoyancy and therefore speed",
              "Staff are more distracted when the facility is busy",
            ],
            correctIndex: 1,
            explanation:
              "The lesson explains that peak attendance creates the highest incident risk because more riders are in the system and the operational pressure to reduce intervals is simultaneously at its strongest. This is not coincidence - maintaining controls under that pressure is the single most important operational skill.",
            type: "knowledge",
          },
          {
            id: "q7-4-3",
            question:
              "The scenario describes a surface that has not been waxed in 4 months. What effect should this have on dispatch intervals compared to a recently waxed surface?",
            options: [
              "No effect - surface waxing only affects aesthetics",
              "Intervals should be decreased because riders will travel slower",
              "Intervals should be increased because slower riders take longer to clear the exit zone",
              "Intervals should match manufacturer defaults regardless of surface condition",
            ],
            correctIndex: 2,
            explanation:
              "A surface without recent waxing will cause riders to travel slower due to friction and potential calcium buildup. Slower riders take longer to clear the exit zone, meaning longer intervals are required to prevent stack-ups. The lesson is explicit: surface condition in this scenario calls for increased intervals, not decreased ones.",
            type: "knowledge",
          },
          {
            id: "q7-4-4",
            question:
              "You are halfway through a long shift during the busiest day of the season and notice your reaction times are slower than normal. What is the correct action?",
            options: [
              "Push through - the team is stretched and no one else is available",
              "Increase your alertness by taking a short walk between dispatches",
              "Request rotation - operating while fatigued is a safety risk that must be escalated",
              "Reduce dispatch intervals to spend less time performing each assessment",
            ],
            correctIndex: 2,
            explanation:
              "The lesson explicitly states: if fatigue or distraction is affecting your performance, request rotation - do not push through. An operator whose performance is compromised by fatigue is a safety risk in a position where split-second decisions matter.",
            type: "scenario",
          },
          {
            id: "q7-4-5",
            question:
              "A supervisor verbally pressures you to reduce dispatch intervals and you maintain your assessment-based intervals instead. What additional step does the lesson recommend?",
            options: [
              "Report the supervisor to facility management immediately",
              "Document the exchange - any pressure to compromise safety controls should be recorded",
              "Request a written order from the supervisor before complying",
              "No further action is needed once you have refused",
            ],
            correctIndex: 1,
            explanation:
              "The lesson explicitly recommends documenting any pressure to compromise safety controls. This creates a record that protects the operator, supports investigation if an incident later occurs and establishes a pattern if the pressure is repeated.",
            type: "scenario",
          },
        ],
      },
    ],
  },
  {
    id: "response-shutdown",
    number: 9,
    title: "Response and Shutdown",
    subtitle: "When Things Go Wrong",
    description:
      "Emergency response protocols, communication chains, post-incident procedures. How to respond fast, correctly and defensibly.",
    icon: "siren",
    color: "#b91c1c",
    badge: { icon: "siren", label: "Response Ready" },
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
            type: "diagram",
            heading: "Emergency Escalation Hierarchy",
            body: "The escalation hierarchy showing who is contacted, in what order and what actions are taken at each level of an emergency response.",
            diagramId: "emergency-response",
          },
          {
            heading: "Immediate Shutdown Triggers",
            type: "checklist",
            body: "Any of these conditions require immediate dispatch cessation:",
            items: [
              "Rider does not exit within expected timeframe - potential blockage",
              "Rider exits with visible injury",
              "Structural failure observed - crack, separation, collapse",
              "Water flow interruption - pump failure, nozzle blockage",
              "Communication system failure between operators",
              "Uncontrolled entry - someone enters the flume without being dispatched",
              "Weather event - lightning, severe wind, sudden heavy rain reducing visibility",
              "Any gut feeling that something is wrong - do not override instinct with rationalisation",
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
          "Instinct is a valid trigger - never rationalise away a safety concern",
          "Every second of delay is a second a rider could be dispatched into danger",
        ],
        quiz: [
          {
            id: "q8-1-1",
            question:
              "You have a gut feeling that something is not right with the slide, but you cannot identify a specific problem. What should you do?",
            options: [
              "Continue operating and monitor closely until you can identify the issue",
              "Stop dispatch immediately - instinct is a valid trigger and should not be overridden with rationalisation",
              "Ask a colleague for a second opinion before stopping",
              "Check the maintenance log to see if anything was reported",
            ],
            correctIndex: 1,
            explanation:
              "A gut feeling that something is wrong is listed as a valid shutdown trigger. You do not need to identify a specific problem or get permission before stopping dispatch. Every second of delay is a second a rider could be dispatched into a dangerous system.",
            type: "scenario",
          },
          {
            id: "q8-1-2",
            question:
              "Do you need supervisor approval before stopping dispatch?",
            options: [
              "Yes - always confirm with a supervisor first",
              "Only during peak hours when stopping affects revenue",
              "No - you do not need permission to stop dispatch. If you see a trigger condition, you stop.",
              "Only if it is a non-emergency situation",
            ],
            correctIndex: 2,
            explanation:
              "You do not need permission to stop dispatch. You do not need to confirm with a supervisor first. If you see a trigger condition, you stop. Every second of delay is a second during which a rider may be dispatched into a dangerous system.",
            type: "knowledge",
          },
          {
            id: "q8-1-3",
            question:
              "Lightning is visible in the distance and a supervisor says to keep operating because the storm looks far away. What is correct?",
            options: [
              "Follow the supervisor's judgment - they have more experience with local weather patterns",
              "Stop dispatch - weather events including lightning are a listed shutdown trigger, regardless of supervisor instruction",
              "Continue operating but monitor the storm closely and be ready to stop",
              "Ask guests if they want to continue before making a decision",
            ],
            correctIndex: 1,
            explanation:
              "Weather events including lightning are a listed immediate shutdown trigger. You do not need permission to stop. The stop protocol lesson is clear: you do not need to confirm with a supervisor first if you observe a trigger condition.",
            type: "scenario",
          },
          {
            id: "q8-1-4",
            question:
              "Your communication radio fails mid-shift. What is the correct response under the stop protocol?",
            options: [
              "Continue operating at reduced dispatch intervals until the radio is repaired",
              "Stop dispatch - communication system failure between operators is a listed shutdown trigger",
              "Use hand signals to communicate with the other operator instead",
              "Ask a passing staff member to relay messages between positions",
            ],
            correctIndex: 1,
            explanation:
              "Communication system failure between operators is explicitly listed as an immediate shutdown trigger. The stop protocols exist because safe operation depends on coordination between top and bottom operators - without communication, neither operator can confirm the system status.",
            type: "defect",
          },
          {
            id: "q8-1-5",
            question:
              "A rider enters the flume from an unauthorized access point without being dispatched. Dispatch at the top station continues normally because the top operator did not see the entry. What should happen?",
            options: [
              "The exit operator should try to pull the unauthorized rider out before they are hit",
              "Stop dispatch immediately - uncontrolled entry is a listed shutdown trigger",
              "Wait to see if the unauthorized rider exits safely before stopping",
              "Activate only a partial stop and allow the already-dispatched rider to proceed",
            ],
            correctIndex: 1,
            explanation:
              "Uncontrolled entry - someone entering the flume without being dispatched - is a listed shutdown trigger. Dispatch must stop immediately. The unauthorized rider's position is unknown to either operator, making any further dispatch into the system dangerous.",
            type: "scenario",
          },
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
              "Partner operator (top/bottom) - immediate coordination",
              "Supervisor on duty - incident management and resource allocation",
              "First aid / lifeguard team - if injury is suspected or confirmed",
              "Emergency services (000 / site emergency number) - for serious injury, entrapment or structural failure",
              "Facility management - for non-immediate issues requiring maintenance response",
              "Manufacturer support - for equipment failures requiring manufacturer guidance",
            ],
          },
          {
            heading: "Communication Protocol",
            type: "text",
            body: "Use structured communication: State your name, location and the situation clearly. 'This is [name] at [slide name] top station. I have stopped dispatch because [reason]. The last rider dispatched at [time]. I need [specific response required].' Clear, structured messages prevent confusion and ensure the correct response is mobilised.",
          },
        ],
        keyTakeaways: [
          "Escalation follows a specific hierarchy based on severity",
          "Structured communication: name, location, situation, need",
          "Clear messages prevent confusion and mobilise correct response",
          "Manufacturer support is available for equipment failures",
        ],
        quiz: [
          {
            id: "q8-2-1",
            question:
              "You have stopped dispatch due to a suspected rider injury at the exit. What is the correct structured communication message?",
            options: [
              "\"Help needed at the slide!\"",
              "\"This is [name] at [slide name] top station. I have stopped dispatch because a rider has exited with a visible injury. Last rider dispatched at [time]. I need first aid response.\"",
              "\"Injury at slide exit - send someone\"",
              "\"Code red at the waterslide\"",
            ],
            correctIndex: 1,
            explanation:
              "Structured communication follows the format: state your name, location, the situation, when the last rider was dispatched and what response you need. Clear, structured messages prevent confusion and mobilise the correct response.",
            type: "knowledge",
          },
          {
            id: "q8-2-2",
            question:
              "After a structural failure is observed, who should be contacted for guidance on the equipment?",
            options: [
              "Only the on-duty supervisor",
              "The local council building inspector",
              "The ride manufacturer for equipment-specific guidance",
              "The insurance company",
            ],
            correctIndex: 2,
            explanation:
              "The escalation hierarchy includes manufacturer support for equipment failures requiring manufacturer-specific guidance. This is in addition to the immediate chain of partner operator, supervisor, first aid and emergency services.",
            type: "knowledge",
          },
          {
            id: "q8-2-3",
            question:
              "You stop dispatch because a rider has not exited within the expected timeframe. Who is the first person you contact?",
            options: [
              "Emergency services (000)",
              "The facility manager on duty",
              "Your partner operator at the other end of the slide",
              "The first aid team",
            ],
            correctIndex: 2,
            explanation:
              "The escalation hierarchy starts with the partner operator for immediate coordination. Emergency services, first aid and management are escalated based on confirmed severity. The partner operator is contacted first because they may have critical information about the last dispatched rider.",
            type: "knowledge",
          },
          {
            id: "q8-2-4",
            question:
              "A rider exits with a suspected spinal injury after an unusual stop partway down the slide. Which contacts should be activated from the escalation hierarchy?",
            options: [
              "Partner operator and supervisor only",
              "Partner operator, supervisor, first aid team and emergency services",
              "Emergency services only - call 000 immediately and wait",
              "Supervisor and facility management only",
            ],
            correctIndex: 1,
            explanation:
              "A suspected spinal injury is a confirmed serious injury requiring immediate coordination. The full escalation chain - partner operator, supervisor on duty, first aid team and emergency services - should be activated. Each contact serves a distinct role in the response.",
            type: "scenario",
          },
          {
            id: "q8-2-5",
            question:
              "Which of the following communication messages is most effective under the structured protocol described in this lesson?",
            options: [
              "\"Slide problem at station 3, need help\"",
              "\"This is [name] at [slide name] top station. I have stopped dispatch because a pump has failed. Last rider dispatched at 2:14pm. I need maintenance and supervisor response.\"",
              "\"Pump failure - calling 000 now\"",
              "\"I'm at the top of the big slide and something is broken\"",
            ],
            correctIndex: 1,
            explanation:
              "Effective communication under the protocol includes: your name, your location, the reason for the stop, the time of the last dispatch and the specific response needed. Vague messages cause confusion and slow the response. Structured messages mobilise exactly the right help.",
            type: "knowledge",
          },
        ],
      },
      {
        id: "8-3",
        title: "Post-Incident Controls",
        duration: "12 min",
        content: [
          {
            type: "text",
            body: "What happens after an incident is as important as the response itself. Correct post-incident procedures protect the injured, preserve evidence, support investigation and reduce your organisation's legal exposure.",
          },
          {
            heading: "Scene Integrity",
            type: "text",
            body: "Do not move equipment, clean surfaces or alter the scene unless necessary for medical treatment. The scene as it exists at the time of the incident is evidence. Photographs should be taken as soon as practical. If the slide was operating, note the flow rate, dispatch times and any equipment readings.",
          },
          {
            heading: "Documentation Requirements",
            type: "checklist",
            body: "Record immediately, while memory is fresh:",
            items: [
              "Exact time of the incident",
              "Exact location on the slide (section number if possible)",
              "Who was involved (rider, operator, witness)",
              "What happened - factual description, not interpretation",
              "What conditions were present (flow rate, surface condition, weather, queue state)",
              "What actions were taken in response",
              "Names and contact details of witnesses",
              "Photographs of the scene, any damage and relevant conditions",
            ],
          },
          {
            heading: "Emotional and Psychological Considerations",
            type: "text",
            body: "Operators involved in incidents experience stress, guilt and anxiety. These are normal responses. Post-incident debriefing should be conducted by a supervisor - not to assign blame, but to support the operator and capture learning. Access to employee assistance programs should be offered where available.",
          },
          {
            type: "warning",
            body: "Never speculate on cause or blame in your documentation. Record facts only. 'The rider exited the catch pool with a visible laceration to the left forearm' - not 'The rider was injured because they were riding incorrectly.'",
          },
        ],
        keyTakeaways: [
          "Scene integrity is evidence - do not alter unless required for medical treatment",
          "Document immediately with facts, not interpretations",
          "Eight specific data points must be recorded",
          "Operator welfare after incidents is a management responsibility",
        ],
        quiz: [
          {
            id: "q8-3-1",
            question:
              "After an incident, a colleague suggests cleaning up the slide exit area before management arrives. What is the correct response?",
            options: [
              "Agree - the area should be presentable",
              "Do not alter the scene unless necessary for medical treatment - the scene as it exists is evidence",
              "Only clean up if no one was injured",
              "Take photos first, then clean up",
            ],
            correctIndex: 1,
            explanation:
              "Scene integrity is critical. Do not move equipment, clean surfaces or alter the scene unless necessary for medical treatment. The scene as it exists at the time of the incident is evidence. Photographs should be taken as soon as practical.",
            type: "scenario",
          },
          {
            id: "q8-3-2",
            question:
              "When documenting an incident, which of the following is the correct way to record what happened?",
            options: [
              "\"The rider was injured because they were riding incorrectly\"",
              "\"The rider exited the catch pool with a visible laceration to the left forearm\"",
              "\"The rider was being reckless and caused their own injury\"",
              "\"I think the surface condition caused the rider to lose control\"",
            ],
            correctIndex: 1,
            explanation:
              "Documentation must record facts only, not interpretations, speculation or blame. 'The rider exited with a visible laceration' is factual. Statements about cause or rider behaviour are interpretations that belong in an investigation, not in your incident record.",
            type: "scenario",
          },
          {
            id: "q8-3-3",
            question:
              "An operator involved in a serious incident is visibly shaken but insists they are fine to continue working. What should happen?",
            options: [
              "If they say they are fine, let them continue",
              "Force them to go home immediately",
              "Post-incident debriefing should be conducted by a supervisor, with access to employee assistance offered",
              "Tell them to take a 10-minute break and then resume",
            ],
            correctIndex: 2,
            explanation:
              "Operators involved in incidents experience stress, guilt and anxiety. Post-incident debriefing should be conducted by a supervisor to support the operator and capture learning, not to assign blame. Access to employee assistance programs should be offered.",
            type: "scenario",
          },
          {
            id: "q8-3-4",
            question:
              "During documentation, you are unsure whether the surface condition caused the incident. How should you record this?",
            options: [
              "Include your theory so investigators have a starting point",
              "Leave the surface condition out of the documentation entirely",
              "Record the factual observation - for example, 'surface had not been waxed in 4 months and appeared dry' - without speculating on causation",
              "Mark the cause as 'unknown' and move on",
            ],
            correctIndex: 2,
            explanation:
              "Documentation records factual observations only, not interpretations or speculation. Note what was observable - the condition of the surface, the timeframe since last waxing - without attributing causation. Causation is determined through investigation, not first-hand documentation.",
            type: "defect",
          },
          {
            id: "q8-3-5",
            question:
              "How soon after an incident should documentation be completed?",
            options: [
              "Within 24 hours, once the operator has had time to process what happened",
              "At the end of the shift, when all facts are compiled",
              "Immediately, while memory is fresh and details are most accurate",
              "After the supervisor has completed their own report",
            ],
            correctIndex: 2,
            explanation:
              "The lesson is explicit: record immediately, while memory is fresh. Details that seem minor - exact times, exact positions, environmental conditions - are accurately recalled immediately after an event and fade rapidly. Delayed documentation creates gaps and inaccuracies that undermine any investigation.",
            type: "knowledge",
          },
        ],
      },
    ],
  },
  {
    id: "assessment",
    number: 10,
    title: "Assessment and Certification",
    subtitle: "Prove Your Competency",
    description:
      "Comprehensive assessment covering knowledge, defect identification and scenario-based decision making. Complete this to earn your certification.",
    icon: "certificate",
    color: "#059669",
    badge: { icon: "certificate", label: "Certified Operator" },
    lessons: [
      {
        id: "9-1",
        title: "Knowledge Assessment",
        duration: "20 min",
        content: [
          {
            type: "text",
            body: "This assessment draws 20 questions at random from a pool covering all 9 modules - standards, inspection procedures, defect recognition, water quality and operational controls. You need 80% or higher to pass. Each attempt presents a different set of questions. Review any module you're unsure about before attempting.",
          },
        ],
        keyTakeaways: [
          "80% pass mark required",
          "20 questions drawn randomly from a pool of 45+",
          "Covers all 9 training modules",
          "Each attempt presents a different set of questions",
        ],
        quiz: [
          {
            id: "q9-1",
            question:
              "What standard is commonly referenced for slide maintenance requirements?",
            options: [
              "ISO 31000",
              "ASTM F1193",
              "EN 1069",
              "AS 3533",
            ],
            correctIndex: 1,
            explanation:
              "FRP maintenance and repair guidance references ASTM F1193 standards for water slide maintenance requirements.",
            type: "knowledge",
          },
          {
            id: "q9-2",
            question:
              "What water quality measurements must be recorded monthly?",
            options: [
              "pH and temperature only",
              "LSI and FAC levels",
              "Turbidity and colour",
              "Chlorine and bromine",
            ],
            correctIndex: 1,
            explanation:
              "LSI (Langelier Saturation Index) and FAC (Free Available Chlorine) levels must be recorded monthly by qualified personnel.",
            type: "knowledge",
          },
          {
            id: "q9-3",
            question:
              "What type of sealant should be used to fill joints between flume sections?",
            options: [
              "Rigid epoxy for maximum strength",
              "Silicone bathroom sealant",
              "Flexible adhesive sealant (as specified by the manufacturer)",
              "Hot glue for quick repairs",
            ],
            correctIndex: 2,
            explanation:
              "Joints must use a flexible adhesive sealant to accommodate thermal expansion and contraction. Rigid fillers will crack and create dangerous edges.",
            type: "knowledge",
          },
          {
            id: "q9-4",
            question:
              "What determines the frequency of buffing and waxing the slide surface?",
            options: [
              "An annual schedule during shutdown periods",
              "The manufacturer's recommended schedule, adapted to facility conditions such as water chemistry, usage and environmental exposure",
              "A fixed weekly schedule regardless of conditions",
              "Only when visible damage or discolouration appears",
            ],
            correctIndex: 1,
            explanation:
              "Buffing and waxing frequency should follow the manufacturer's recommended schedule and be adapted to your facility's conditions. This is a safety requirement, not just cosmetic - waxed surfaces prevent calcium buildup that causes riders to stick.",
            type: "knowledge",
          },
          {
            id: "q9-5",
            question:
              "During peak attendance, a supervisor asks you to dispatch riders faster. The surface was last waxed 5 months ago and you've noticed riders seem slower today. What do you do?",
            options: [
              "Follow the supervisor's instruction",
              "Refuse and walk off the position",
              "Communicate the surface condition risk, maintain or increase intervals and document the exchange",
              "Reduce intervals slightly as a compromise",
            ],
            correctIndex: 2,
            explanation:
              "Safety controls are not subject to hierarchy override. Communicate the risk assessment, maintain safe intervals and document any pressure to compromise controls.",
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
              "You find a puncture hole in the flume surface during your morning inspection. The facility opens in 20 minutes. What is the correct action?",
            options: [
              "Cover it with waterproof tape and monitor it",
              "The slide does not open - punctures must be repaired immediately to maintain slide integrity",
              "Open the slide but avoid dispatching riders over that section",
              "Fill it with silicone sealant for a temporary fix",
            ],
            correctIndex: 1,
            explanation:
              "Punctures must be repaired immediately to maintain the integrity of the slide. The slide should not operate with a punctured surface.",
            type: "defect",
          },
          {
            id: "q9-8",
            question:
              "What are the four inspection tiers defined by industry standards?",
            options: [
              "Quick, Standard, Detailed, Emergency",
              "Routine, Periodic, Thorough, Structural",
              "Daily, Weekly, Monthly, Annual",
              "Visual, Physical, Chemical, Structural",
            ],
            correctIndex: 1,
            explanation:
              "Industry standards define Routine (daily), Periodic (monthly/quarterly/yearly), Thorough (by competent professional) and Structural (when damage is suspected) inspection tiers.",
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
              "Fiberglass must not be put over joints because glassed-over joints that crack may leave jagged edges that can injure riders.",
            type: "knowledge",
          },
          {
            id: "q9-10",
            question:
              "After an incident, an upset parent demands to know what went wrong. What is the correct response?",
            options: [
              "Explain what you think happened to calm them down",
              "Apologise and accept responsibility to de-escalate",
              "Provide factual, limited information and direct them to facility management - do not speculate on cause",
              "Ignore them and focus on the scene",
            ],
            correctIndex: 2,
            explanation:
              "Post-incident communication should be factual and limited. Speculation on cause or acceptance of responsibility has legal implications. Direct the person to facility management who are trained in incident communication.",
            type: "scenario",
          },
          // --- Module 1: System Understanding (5 questions) ---
          {
            id: "q9-11",
            question:
              "A body slide, a tube slide and a mat racer all share the same support structure at a facility. During a periodic inspection, a crack is found in one support column. Which slides are affected?",
            options: [
              "Only the slide directly above the cracked column",
              "All three slides - a shared support structure means all rides depend on it",
              "Only the heaviest-traffic slide that places the most load on the column",
              "None - support column cracks are cosmetic unless the column has fully collapsed",
            ],
            correctIndex: 1,
            explanation:
              "A shared support structure is a shared dependency. A crack in one column affects the structural integrity of the entire framework, meaning all rides it supports must be taken out of service until assessed by qualified personnel.",
            type: "scenario",
          },
          {
            id: "q9-12",
            question:
              "Why does thermal expansion matter for waterslide flume sections?",
            options: [
              "FRP sections expand and contract with temperature changes, which is why joints must use flexible sealant rather than rigid filler",
              "Thermal expansion only affects metal support structures, not the FRP flume itself",
              "It causes water temperature to fluctuate, which affects rider comfort",
              "Thermal expansion is only relevant during the installation phase and does not affect daily operations",
            ],
            correctIndex: 0,
            explanation:
              "FRP sections expand and contract with temperature changes throughout the day. Joints between sections must accommodate this movement using flexible sealant. Rigid fillers crack under thermal cycling, creating lips and sharp edges that injure riders.",
            type: "knowledge",
          },
          {
            id: "q9-13",
            question:
              "What is gelcoat and what role does it play in a waterslide system?",
            options: [
              "A decorative paint applied for branding and colour consistency",
              "The protective outer layer of FRP that shields the structural fiberglass from water, chemicals and UV",
              "A wax coating applied monthly to reduce rider friction",
              "An anti-corrosion treatment applied to metal support columns",
            ],
            correctIndex: 1,
            explanation:
              "Gelcoat is the protective outer layer of the FRP flume. When it fails through peeling, cracking or wearing through, the structural fiberglass beneath is exposed to water, chemicals and UV radiation, which accelerates degradation and creates rough surfaces that affect rider safety.",
            type: "knowledge",
          },
          {
            id: "q9-14",
            question:
              "On a tube slide, the hydraulic system delivers water through nozzles along the flume. If three of twelve nozzles are blocked, what is the operational impact?",
            options: [
              "Rider experience is slightly reduced but there is no safety concern",
              "Multiple dry spots form where riders lose water lubrication, causing unpredictable deceleration and making dispatch timing unreliable",
              "Water pressure increases through the remaining nozzles, compensating for the blockages",
              "The impact is limited to increased noise from the remaining nozzles",
            ],
            correctIndex: 1,
            explanation:
              "Blocked nozzles create dry spots where riders lose the water lubrication they depend on. Multiple blocked nozzles create multiple unpredictable deceleration zones, making dispatch timing unreliable and significantly increasing collision risk. The slide should not operate until all nozzles are confirmed functional.",
            type: "scenario",
          },
          {
            id: "q9-15",
            question:
              "Which of the following best describes the catch pool in a waterslide system?",
            options: [
              "A decorative water feature at the base of the slide",
              "The deceleration and exit zone at the base that must be confirmed clear before each dispatch",
              "A filtration pool that recycles water back to the hydraulic system",
              "An optional feature only required on slides taller than 10 metres",
            ],
            correctIndex: 1,
            explanation:
              "The catch pool is the deceleration and exit zone at the base of the slide. It is a critical safety component - it must be completely clear before each dispatch. A rider still in the catch pool area means the exit zone is not safe for the next rider.",
            type: "knowledge",
          },
          // --- Module 2: Inspections (5 questions) ---
          {
            id: "q9-16",
            question:
              "A competent professional conducts a thorough inspection and identifies subsurface delamination using tap testing. Why could this defect not have been found during routine daily inspections?",
            options: [
              "Daily inspections are performed too quickly to notice anything",
              "Routine inspections are visual checks for obvious hazards - subsurface delamination requires non-destructive testing methods beyond daily inspection scope",
              "The defect only develops between routine inspection cycles",
              "Daily inspectors are not allowed to touch the flume surface",
            ],
            correctIndex: 1,
            explanation:
              "Routine daily inspections identify obvious surface hazards through visual and tactile checks. Subsurface delamination is internal structural degradation that requires specialist techniques like tap testing or ultrasonic measurement. This is why multiple inspection tiers exist - daily checks do not replace deeper professional assessment.",
            type: "knowledge",
          },
          {
            id: "q9-17",
            question:
              "During a pre-opening inspection, you discover that two safety signs are missing from the tower entrance. The rest of the inspection is satisfactory. Can the slide open?",
            options: [
              "Yes - the signs can be replaced later in the day",
              "No - missing or damaged safety signage is a listed shutdown condition that must be corrected before opening",
              "Yes - as long as operators verbally communicate the rules to each rider",
              "Only if a supervisor approves the opening without signage",
            ],
            correctIndex: 1,
            explanation:
              "Missing or damaged safety signage is explicitly listed as an immediate shutdown trigger. Signage is a safety control that communicates ride rules, restrictions and warnings to riders before they enter. The slide must not open until all required signage is present and legible.",
            type: "scenario",
          },
          {
            id: "q9-18",
            question:
              "What is the purpose of performing the pre-opening flume inspection before the water supply is turned on?",
            options: [
              "To save water while the inspection is being completed",
              "To allow the inspector to see the dry flume surface clearly and identify cracks, chips, foreign objects and joint conditions without water concealing them",
              "Because the pump needs time to warm up before operation",
              "To check that the drainage system is working before adding water",
            ],
            correctIndex: 1,
            explanation:
              "Inspecting before water is turned on allows the inspector to see the dry flume surface in full detail. Water flowing over the surface can conceal cracks, chips, deposits and joint deterioration. Industry best practice requires this sequence to ensure all defects are identified.",
            type: "knowledge",
          },
          {
            id: "q9-19",
            question:
              "A periodic inspection reveals that bolt torque on several structural connections has loosened since the last check. What does this finding indicate?",
            options: [
              "Normal settling that does not require action",
              "Potential vibration fatigue or thermal cycling affecting the support structure, requiring re-torquing and increased monitoring frequency",
              "The bolts were over-tightened during installation and are now at the correct tension",
              "The inspection method was inaccurate and should be repeated",
            ],
            correctIndex: 1,
            explanation:
              "Loosened bolt torque on structural connections indicates that vibration, thermal cycling or load stress is affecting the fasteners. Bolt torque checks are a periodic inspection item specifically because ongoing structural loads can loosen connections over time. Re-torque to specification and increase monitoring frequency to establish whether this is progressive.",
            type: "defect",
          },
          {
            id: "q9-20",
            question:
              "Industry best practice recommends that a lifeguard or attendant should be the first to ride each day. What is the purpose of this practice?",
            options: [
              "To reward staff with a ride before the facility opens",
              "To serve as a final live operational check confirming the ride is safe for the general public",
              "To warm up the flume surface before guests ride",
              "To test whether the water temperature is comfortable",
            ],
            correctIndex: 1,
            explanation:
              "Having a trained staff member ride first serves as a final operational check after all pre-opening inspections and system startups are complete. The staff rider can detect issues that static inspection might miss - unusual vibrations, unexpected speed changes, rough spots or abnormal water coverage.",
            type: "knowledge",
          },
          // --- Module 3: Surface & Rider Interaction (5 questions) ---
          {
            id: "q9-21",
            question:
              "A facility operates both indoor and outdoor slides. During summer, the outdoor slides require more frequent waxing than the indoor slides. Why?",
            options: [
              "Outdoor slides are longer and therefore experience more friction",
              "UV exposure, higher evaporation rates and greater environmental debris accelerate surface degradation on outdoor slides",
              "Indoor slides have lower rider throughput so they wear more slowly",
              "The waxing schedule is the same for all slides regardless of location",
            ],
            correctIndex: 1,
            explanation:
              "Outdoor slides are exposed to UV radiation that degrades the gelcoat, higher temperatures that increase water evaporation and mineral deposit formation, and environmental debris. These factors accelerate surface degradation, requiring more frequent waxing to maintain safe friction levels. Waxing frequency should be adapted to facility conditions per industry best practice.",
            type: "knowledge",
          },
          {
            id: "q9-22",
            question:
              "A heavier adult and a lighter child are dispatched at the same interval on the same slide. The child travels noticeably slower. What physical principle explains this speed difference?",
            options: [
              "Children have higher wind resistance due to their clothing",
              "Heavier riders generate more gravitational force relative to friction, resulting in higher speeds - lighter riders experience proportionally more friction effect",
              "The water flow pushes heavier riders faster",
              "Children are more cautious and deliberately slow themselves down",
            ],
            correctIndex: 1,
            explanation:
              "Rider weight affects the balance between gravitational force and friction. Heavier riders generate more gravitational force relative to surface friction, so they travel faster. Lighter riders experience proportionally greater friction effect, so they travel slower. This speed differential is a key dispatch timing consideration.",
            type: "knowledge",
          },
          {
            id: "q9-23",
            question:
              "An operator observes that riders are arriving at the exit zone faster than usual after the slide was waxed yesterday. How should this affect operations?",
            options: [
              "No adjustment needed - faster riders clear the zone more quickly",
              "Dispatch intervals may need adjustment because faster exit speeds change the dynamics in the catch pool and riders may overshoot the expected deceleration zone",
              "The waxing was done incorrectly and should be removed",
              "Reduce water flow to compensate for the increased speed",
            ],
            correctIndex: 1,
            explanation:
              "A freshly waxed surface reduces friction and increases rider speed. Faster riders arrive at the exit zone with more momentum, which can change catch pool dynamics. Operators should assess whether the increased speed requires dispatch timing adjustment and monitor exit zone clearance carefully until the new surface condition is understood.",
            type: "scenario",
          },
          {
            id: "q9-24",
            question:
              "What is the correct rider position for a standard body slide, and why must it be established before dispatch?",
            options: [
              "Seated upright with hands on the flume walls, confirmed during the ride via camera",
              "Supine (lying back, feet first) with arms crossed, confirmed before dispatch because position cannot be safely corrected once the rider is moving",
              "Head-first prone position for maximum speed and control",
              "Any comfortable position chosen by the rider, as the water cushion prevents injury",
            ],
            correctIndex: 1,
            explanation:
              "Standard body slides require a supine position - lying back, feet first. This must be confirmed before dispatch because once a rider enters the flume and is moving, there is no safe way to stop or reposition them. An incorrect position continues unchecked through the entire ride.",
            type: "knowledge",
          },
          {
            id: "q9-25",
            question:
              "During a hot afternoon, you notice the time between riders clearing the exit has increased by several seconds compared to the morning. Water flow readings are unchanged. What is the most likely cause?",
            options: [
              "Riders are tired in the afternoon and move through the exit zone more slowly",
              "Afternoon heat is drying the flume surface faster between riders, increasing friction and slowing riders down",
              "The pump is losing efficiency due to overheating",
              "Wind direction has changed, creating air resistance in the flume",
            ],
            correctIndex: 1,
            explanation:
              "Afternoon heat causes water to evaporate from the flume surface more quickly between riders. Even with correct water flow, the surface between riders can become partially dry in hot conditions, increasing friction and slowing transit times. This is a recognised operational factor that requires increased dispatch intervals.",
            type: "scenario",
          },
          // --- Module 4: Core Operations (4 questions) ---
          {
            id: "q9-26",
            question:
              "The operations manual specifies a minimum of two operators for a particular slide - one at the top and one at the exit. A colleague calls in sick and no replacement is available. Can the slide operate with one operator?",
            options: [
              "Yes - one experienced operator can manage both positions",
              "No - the closed communication loop between top and bottom operators is a safety requirement and cannot function with a single operator",
              "Yes - if the operator positions themselves at a midpoint with visibility of both zones",
              "Only during low-attendance periods when rider volume is minimal",
            ],
            correctIndex: 1,
            explanation:
              "The dispatch system requires a closed communication loop between top and bottom operators. The top cannot dispatch without exit clearance from the bottom. A single operator cannot confirm exit clearance and manage dispatch simultaneously. Staffing requirements defined in the operations manual are not adjustable based on availability.",
            type: "scenario",
          },
          {
            id: "q9-27",
            question:
              "A rider meets the height requirement but is wearing board shorts with a metal zipper and a belt with a buckle. What items must be addressed before dispatch?",
            options: [
              "Only the belt - zippers on board shorts are acceptable",
              "Both the belt with buckle and the shorts with metal zipper must be addressed - clothing with zippers, buckles or rivets is prohibited",
              "Neither - clothing rules only apply to jewellery and accessories",
              "Only the buckle - it is the only item that could catch on the flume",
            ],
            correctIndex: 1,
            explanation:
              "Clothing with zippers, buckles or rivets is explicitly prohibited. Metal hardware can catch on the flume surface, cause abrasion injuries to the rider and damage the gelcoat. Both items must be removed or replaced before dispatch is permitted.",
            type: "scenario",
          },
          {
            id: "q9-28",
            question:
              "What does 'positive confirmation of exit clearance' mean in the context of dispatch control?",
            options: [
              "The top operator visually estimates that enough time has passed since the last dispatch",
              "The exit operator actively signals that the catch pool is completely clear - no rider in the water, climbing out or standing at the edge",
              "An automated sensor confirms the exit zone is empty",
              "The previous rider waves to indicate they are safely out of the pool",
            ],
            correctIndex: 1,
            explanation:
              "Positive confirmation means the exit operator actively signals that the catch pool is completely clear. This is not assumed from timing, estimated from the top or delegated to riders. The exit operator confirms full clearance every single time before dispatch can proceed.",
            type: "knowledge",
          },
          {
            id: "q9-29",
            question:
              "An operator is positioned at the top station but cannot see the final curve before the exit due to the slide layout. How does this affect their dispatch responsibilities?",
            options: [
              "They should lean out to try to see the exit zone before each dispatch",
              "They must rely entirely on the exit operator's clearance signal and cannot dispatch based on assumed timing or partial visibility",
              "They should use a stopwatch to time intervals precisely and dispatch accordingly",
              "They should reposition to see the exit, even if it means leaving the dispatch station",
            ],
            correctIndex: 1,
            explanation:
              "When the top operator has blind spots due to slide configuration, the exit operator's clearance signal becomes the only reliable confirmation. Dispatch based on assumed timing or partial visibility is not acceptable. The closed communication loop exists specifically for configurations where direct visual confirmation is impossible.",
            type: "knowledge",
          },
          // --- Module 5: Defect Recognition (5 questions) ---
          {
            id: "q9-30",
            question:
              "You discover a network of fine surface lines across a section of flume that looks like cracked porcelain. The lines do not appear to penetrate the full thickness of the gelcoat. What type of defect is this?",
            options: [
              "Structural cracking requiring immediate shutdown",
              "Crazing - fine surface cracks in the gelcoat that indicate stress or UV degradation and require assessment for potential escalation",
              "Normal surface texture from rider friction wear",
              "Mineral deposit patterns from hard water",
            ],
            correctIndex: 1,
            explanation:
              "Crazing appears as a network of fine surface cracks, often resembling cracked porcelain. It indicates stress in the gelcoat from UV degradation, thermal cycling or chemical exposure. While crazing may not immediately compromise structural integrity, it exposes the FRP beneath and can progress to deeper cracking if left unaddressed. Document and escalate for assessment.",
            type: "defect",
          },
          {
            id: "q9-31",
            question:
              "During an inspection, you notice a section of the flume surface has a raised, bubble-like area approximately 5 cm across. The surface is not cracked but feels spongy when pressed. What defect is this?",
            options: [
              "A wax buildup from over-application during the last maintenance cycle",
              "Osmotic blistering or delamination - water has penetrated beneath the gelcoat and is separating the layers",
              "An air pocket trapped during the original manufacturing process that has always been there",
              "Surface contamination from cleaning chemicals that will dissipate naturally",
            ],
            correctIndex: 1,
            explanation:
              "A raised, spongy area on the flume surface indicates osmotic blistering or delamination. Water has penetrated through the gelcoat and is separating the FRP layers beneath. This defect compromises the structural integrity of the section and must be documented, assessed and repaired. The slide should not operate with active delamination in the rider contact zone.",
            type: "defect",
          },
          {
            id: "q9-32",
            question:
              "A star-shaped pattern of cracks radiates from a single point on the flume. What does this indicate about the cause of the damage?",
            options: [
              "Thermal stress from prolonged sun exposure",
              "A point impact - a hard object struck the surface with concentrated force at that location",
              "Chemical erosion from pool water with low pH",
              "Normal fatigue cracking from years of rider traffic",
            ],
            correctIndex: 1,
            explanation:
              "A star fracture pattern radiating from a central point is characteristic of point impact damage - a hard object struck the surface with concentrated force. This is a structural defect requiring immediate shutdown. The impact may have caused subsurface damage beyond what is visible, so professional assessment is required.",
            type: "defect",
          },
          {
            id: "q9-33",
            question:
              "An operator finds a joint where the sealant has not failed, but there is a slight lip where two flume sections meet. The lip is less than 1 mm high. Should the slide operate?",
            options: [
              "Yes - a 1 mm lip is negligible and will not affect riders",
              "The operator should assess whether the lip creates a catching hazard - any lip that could catch a rider's skin or swimwear requires shutdown regardless of size",
              "Yes - but only for raft rides where riders do not contact the surface directly",
              "Only if the lip is sanded smooth before opening",
            ],
            correctIndex: 1,
            explanation:
              "The shutdown decision for joint issues is based on whether a lip, gap or sharp edge exists - not on a specific measurement threshold. Riders travelling at 20-40 km/h can catch even small edges. The operator must assess whether the lip creates a catching hazard. If there is any doubt, shut down and escalate for professional assessment.",
            type: "defect",
          },
          {
            id: "q9-34",
            question:
              "What is the difference between a chip and a puncture on a flume surface, and why does the distinction matter for the shutdown decision?",
            options: [
              "There is no meaningful difference - both are cosmetic issues",
              "A chip removes surface gelcoat but may not penetrate through the FRP; a puncture is a hole through the slide surface. Punctures require immediate shutdown while chips are documented and scheduled for repair.",
              "A chip is larger than a puncture and therefore more serious",
              "A puncture only affects the underside of the flume while chips affect the riding surface",
            ],
            correctIndex: 1,
            explanation:
              "A chip damages the gelcoat surface layer and may expose the fiberglass beneath, but does not necessarily penetrate the full thickness. A puncture is a hole through the slide surface that compromises structural integrity and allows water ingress. Punctures are structural defects requiring immediate shutdown; chips are surface defects that are documented and scheduled for maintenance.",
            type: "knowledge",
          },
          // --- Module 6: Water Quality (5 questions) ---
          {
            id: "q9-35",
            question:
              "An outdoor facility maintains FAC at 1.5 ppm. According to industry best practice, is this level appropriate?",
            options: [
              "Yes - 1.5 ppm is within the standard range for all facilities",
              "No - outdoor facilities require 2.0-4.0 ppm because UV from sunlight degrades chlorine faster than in indoor environments",
              "It depends on the number of riders using the facility that day",
              "No - all facilities should maintain FAC above 4.0 ppm for maximum disinfection",
            ],
            correctIndex: 1,
            explanation:
              "Industry best practice specifies different FAC ranges for indoor and outdoor facilities. Indoor facilities typically target 1.0-3.0 ppm, while outdoor facilities require a higher range of 2.0-4.0 ppm because UV radiation from sunlight degrades chlorine. At 1.5 ppm, this outdoor facility is below the recommended minimum.",
            type: "knowledge",
          },
          {
            id: "q9-36",
            question:
              "The facility's water has a pH reading of 8.2. What concern does this raise?",
            options: [
              "No concern - pH 8.2 is within normal limits for aquatic facilities",
              "The pH exceeds the recommended range of 7.2-7.8, which reduces chlorine effectiveness and can contribute to scaling on flume surfaces",
              "The water is too acidic and will corrode metal components",
              "The pH only matters for swimmer comfort and has no equipment impact",
            ],
            correctIndex: 1,
            explanation:
              "The recommended pH range is 7.2-7.8. At pH 8.2, the water is above the acceptable range. High pH significantly reduces the effectiveness of free chlorine as a disinfectant and shifts the LSI toward positive (scaling), which can accelerate mineral deposit formation on flume surfaces and equipment.",
            type: "knowledge",
          },
          {
            id: "q9-37",
            question:
              "Who is responsible for water chemistry management at a waterslide facility?",
            options: [
              "The slide operators alone, since they are closest to the water",
              "An external water treatment company that visits monthly",
              "It is a shared responsibility - facility water treatment staff manage chemistry while operators report visual indicators and observations",
              "The ride manufacturer, as part of the warranty obligations",
            ],
            correctIndex: 2,
            explanation:
              "Water chemistry management is a shared responsibility. Facility water treatment or maintenance staff manage the chemical balance, while operators serve as the most frequent observers and report visual indicators such as scaling, staining or changes in surface condition. Operators do not adjust water chemistry themselves.",
            type: "knowledge",
          },
          {
            id: "q9-38",
            question:
              "A facility shock-treats the pool at 10 PM after closing. The facility opens at 9 AM the next day. A maintenance worker says the water looks clear so the slide can open. Is this correct?",
            options: [
              "Yes - overnight treatment gives sufficient time for chemistry to normalize",
              "No - water quality measurements must confirm levels are within correct limits before the ride reopens, regardless of visual clarity",
              "Yes - as long as the FAC is above zero, the slide can operate",
              "Only if the shock treatment was a standard dose, not a double dose",
            ],
            correctIndex: 1,
            explanation:
              "Industry best practice requires that water quality must be retested following any pool shock treatment, with measurements confirming levels are back within acceptable limits before the ride is reopened. Visual clarity is not a substitute for chemical testing. Shock treatment uses concentrated chemicals that may still be at levels unsafe for riders or equipment.",
            type: "scenario",
          },
          {
            id: "q9-39",
            question:
              "Calcium hardness in the facility's water supply has increased due to a change in the municipal water source. What effect could this have on waterslide operations if left unaddressed?",
            options: [
              "No effect - calcium hardness only matters for swimming pool clarity",
              "Increased calcium hardness shifts the LSI positive, accelerating scale formation on flume surfaces, reducing rider speed predictability and blocking nozzles",
              "It makes the water softer, which increases corrosion risk on metal components",
              "It only affects the taste of the water and has no operational impact",
            ],
            correctIndex: 1,
            explanation:
              "Calcium hardness is a component of the LSI calculation. Higher calcium hardness shifts the LSI positive (toward scaling). This accelerates mineral deposit formation on flume surfaces, creates variable friction zones affecting rider speed, and can block hydraulic nozzles. Water chemistry must be adjusted to compensate for source water changes.",
            type: "scenario",
          },
          // --- Module 7: Incident Prevention (4 questions) ---
          {
            id: "q9-40",
            question:
              "The hierarchy of controls ranks elimination as the most effective control and PPE as the least effective. In waterslide operations, which of the following is an example of an engineering control?",
            options: [
              "Training operators to identify defects during inspections",
              "Installing physical barriers at unauthorized access points to prevent uncontrolled entry into the flume",
              "Posting safety signage at the top of the slide",
              "Requiring riders to wear protective footwear",
            ],
            correctIndex: 1,
            explanation:
              "Engineering controls are physical modifications that reduce risk without relying on human behaviour. Physical barriers at unauthorized access points prevent uncontrolled entry regardless of whether staff are present. Training is an administrative control, signage is an administrative control and PPE is the lowest tier in the hierarchy.",
            type: "knowledge",
          },
          {
            id: "q9-41",
            question:
              "A near-miss occurs when a rider stops briefly mid-slide but self-recovers and exits without injury. No collision occurred. Should this event be reported?",
            options: [
              "No - no injury means no report is required",
              "Yes - near-miss reporting captures events that could have resulted in injury and helps identify developing risks before they cause an incident",
              "Only if a supervisor witnessed the event",
              "Only if the rider makes a formal complaint",
            ],
            correctIndex: 1,
            explanation:
              "Near-miss reporting is a critical prevention tool. An event where a rider stops mid-slide but self-recovers indicates conditions exist that could cause a full stoppage and collision under slightly different circumstances. Reporting near-misses helps identify developing risks - such as surface degradation or flow issues - before they cause an actual injury.",
            type: "scenario",
          },
          {
            id: "q9-42",
            question:
              "A severe thunderstorm warning is issued for the area. The storm is forecast to arrive in 45 minutes. Rider queues are at capacity. What is the correct operational response?",
            options: [
              "Continue operating until rain begins, then shut down",
              "Begin orderly shutdown procedures now - clear riders from the queue, close the slide and prepare for severe weather before the storm arrives",
              "Continue operating and monitor the weather radar for the storm's actual position",
              "Reduce queue size by half and continue dispatching until lightning is visible",
            ],
            correctIndex: 1,
            explanation:
              "Weather protocols require proactive response, not reactive. A severe thunderstorm warning with a 45-minute lead time requires beginning shutdown procedures immediately. Clearing riders from elevated tower positions and exposed slides before dangerous conditions arrive is the safe approach. Waiting for visible lightning puts riders and staff at risk.",
            type: "scenario",
          },
          {
            id: "q9-43",
            question:
              "An operator is screening riders at the top of the slide and notices a guest who appears to have a medical condition that may be affected by the ride forces. The guest does not meet any of the posted exclusion criteria. What should the operator do?",
            options: [
              "Allow the rider - they do not meet any listed exclusion criteria",
              "Refuse the rider based on their appearance",
              "Politely ask the rider if they have any medical conditions that may be affected by the ride, and if uncertain, consult the supervisor or facility first aid team",
              "Allow the rider but increase the dispatch interval as a precaution",
            ],
            correctIndex: 2,
            explanation:
              "Rider screening requires professional judgment beyond checking posted criteria. If an operator has a reasonable concern about a guest's ability to ride safely, they should politely inquire and consult with a supervisor or first aid team if uncertain. This protects both the rider and the facility without making assumptions based on appearance alone.",
            type: "scenario",
          },
          // --- Module 8: Response & Shutdown (3 questions) ---
          {
            id: "q9-44",
            question:
              "After a rider exits with a visible laceration, the slide is shut down and emergency response is activated. A manager asks you to restart the slide 30 minutes later because the injury 'was not that serious.' What is the correct response?",
            options: [
              "Restart - the manager has assessed the severity and made the decision",
              "The slide should not restart until the cause of the injury has been investigated, the defect (if any) has been identified and corrected, and the slide has been cleared for operation",
              "Restart but increase dispatch intervals as a precaution",
              "Restart only if the injured rider confirms they are satisfied",
            ],
            correctIndex: 1,
            explanation:
              "A rider injury triggers investigation requirements. The slide should not restart until the cause has been investigated, any contributing defect has been identified and corrected, and the slide has been formally cleared for operation. The severity of the injury does not determine whether investigation is required - any injury event requires root cause assessment.",
            type: "scenario",
          },
          {
            id: "q9-45",
            question:
              "Following a serious incident, an operator is asked to write their account of what happened. Which of the following statements should NOT appear in the documentation?",
            options: [
              "\"The rider exited at 2:47 PM with a visible injury to the right ankle.\"",
              "\"Surface condition appeared dry in section 4, and waxing had not been completed in the last 3 months.\"",
              "\"The incident was caused by the rider ignoring the positioning instructions I gave them.\"",
              "\"The last dispatch was at 2:46 PM with a 20-second interval.\"",
            ],
            correctIndex: 2,
            explanation:
              "Post-incident documentation must record facts only, not interpretations or blame. Stating that the incident 'was caused by' the rider's behaviour is speculation and attribution of blame. The other options record factual observations - time, visible condition, surface state and dispatch data - which are appropriate for incident documentation.",
            type: "knowledge",
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
