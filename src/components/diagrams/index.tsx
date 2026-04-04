"use client";

import { SlideCrossSection } from "./SlideCrossSection";
import { InspectionZones } from "./InspectionZones";
import { SurfaceDefects } from "./SurfaceDefects";
import { DispatchFlow } from "./DispatchFlow";
import { DefectRecognition } from "./DefectRecognition";
import { WaterChemistry } from "./WaterChemistry";
import { IncidentChain } from "./IncidentChain";
import { EmergencyResponse } from "./EmergencyResponse";

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
