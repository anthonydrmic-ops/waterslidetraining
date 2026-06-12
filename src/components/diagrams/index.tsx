"use client";

import { SlideCrossSection } from "./SlideCrossSection";
import { InspectionZones } from "./InspectionZones";
import { SurfaceDefects } from "./SurfaceDefects";
import { DispatchFlow } from "./DispatchFlow";
import { DefectRecognition } from "./DefectRecognition";
import { WaterChemistry } from "./WaterChemistry";
import { IncidentChain } from "./IncidentChain";
import { EmergencyResponse } from "./EmergencyResponse";
import { AustraliaWHSMap } from "./AustraliaWHSMap";
import { DispatchCollision } from "./DispatchCollision";
import { PoolExitCollision } from "./PoolExitCollision";
import { StandardsStack } from "./StandardsStack";
import { ComplianceDuties } from "./ComplianceDuties";
import { RolesMatrix } from "./RolesMatrix";
import { InspectionTiers } from "./InspectionTiers";
import { ShutdownDecision } from "./ShutdownDecision";
import { SurfaceSpeed } from "./SurfaceSpeed";
import { RiderRules } from "./RiderRules";
import { ExitLoop } from "./ExitLoop";
import { DefectResponse } from "./DefectResponse";
import { WaterIndicators } from "./WaterIndicators";
import {
  ScenarioNonCompliant,
  ScenarioBlockage,
  ScenarioThroughput,
  PostIncidentSteps,
} from "./ProtocolLadder";
import { WindResponse } from "./WindResponse";
import { CommsProtocol } from "./CommsProtocol";
import { FlowMeterCheck } from "./FlowMeterCheck";
import { WeightWindow } from "./WeightWindow";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const diagramMap: Record<string, React.ComponentType<any>> = {
  "slide-cross-section": SlideCrossSection,
  "inspection-zones": InspectionZones,
  "surface-defects": SurfaceDefects,
  "dispatch-flow": DispatchFlow,
  "defect-recognition": DefectRecognition,
  "water-chemistry": WaterChemistry,
  "incident-chain": IncidentChain,
  "emergency-response": EmergencyResponse,
  "whs-jurisdiction-map": AustraliaWHSMap,
  "dispatch-collision": DispatchCollision,
  "pool-exit-collision": PoolExitCollision,
  "standards-stack": StandardsStack,
  "compliance-duties": ComplianceDuties,
  "roles-matrix": RolesMatrix,
  "inspection-tiers": InspectionTiers,
  "shutdown-decision": ShutdownDecision,
  "surface-speed": SurfaceSpeed,
  "rider-rules": RiderRules,
  "exit-loop": ExitLoop,
  "defect-response": DefectResponse,
  "water-indicators": WaterIndicators,
  "scenario-noncompliant": ScenarioNonCompliant,
  "scenario-blockage": ScenarioBlockage,
  "scenario-throughput": ScenarioThroughput,
  "post-incident-steps": PostIncidentSteps,
  "comms-protocol": CommsProtocol,
  "wind-response": WindResponse,
  "flow-meter-check": FlowMeterCheck,
  "weight-window": WeightWindow,
};

export function Diagram({ id }: { id: string }) {
  const Component = diagramMap[id];
  if (!Component) return null;
  return (
    <div className="my-2 rounded-2xl border border-stone-200/60 bg-stone-50/50 p-4 md:p-6 overflow-hidden">
      <Component />
    </div>
  );
}

export { diagramMap };
