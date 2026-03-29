"use client";

import { use } from "react";
import { modules } from "@/data/training-modules";
import { redirect } from "next/navigation";

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod || mod.lessons.length === 0) redirect("/train");
  redirect(`/train/${moduleId}/${mod.lessons[0].id}`);
}
