"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  ChartBar,
  Crown,
  Certificate,
} from "@phosphor-icons/react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
  },
};

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  progress: number;
  completedModules: number;
  completedLessons: number;
  certified: boolean;
  certificationDate: string | null;
}

interface DashboardData {
  orgName: string | null;
  members: TeamMember[];
  license: {
    total_seats: number;
    used_seats: number;
    status: string;
    course_id: string;
  } | null;
  isAdmin: boolean;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/dashboard")
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            setError("Sign in to access the dashboard.");
          } else {
            setError("Could not load dashboard data.");
          }
          return;
        }
        const json = await res.json();
        setData(json);
      })
      .catch(() => setError("Could not connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  const members = data?.members || [];
  const totalMembers = members.length;
  const certified = members.filter((m) => m.certified).length;
  const avgProgress = totalMembers
    ? Math.round(members.reduce((acc, m) => acc + m.progress, 0) / totalMembers)
    : 0;

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] relative">
      <div className="noise-overlay" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 pt-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="nav-glass rounded-full px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/train"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-[0.95] transition-all duration-300"
              >
                <ArrowLeft size={14} weight="bold" className="text-stone-500" />
              </Link>
              <span className="text-sm font-semibold tracking-tight text-stone-700">
                Team Dashboard
              </span>
            </div>
            {data?.orgName && (
              <span className="text-xs text-stone-400 font-medium">{data.orgName}</span>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-16">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10">
            <h1 className="text-3xl font-bold tracking-tighter text-stone-900 mb-2">
              Team Progress
            </h1>
            <p className="text-stone-400 text-base">
              Track your team's training completion and certification status.
            </p>
          </motion.div>

          {/* Loading / Error states */}
          {loading && (
            <motion.div variants={fadeUp} className="text-center py-20">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ChartBar size={20} weight="duotone" className="text-stone-400" />
              </div>
              <p className="text-stone-400 text-sm">Loading dashboard...</p>
            </motion.div>
          )}

          {error && (
            <motion.div variants={fadeUp} className="text-center py-20">
              <p className="text-stone-500 font-medium mb-1">{error}</p>
              <Link href="/sign-in" className="text-sm text-[var(--accent)] hover:underline">
                Sign in
              </Link>
            </motion.div>
          )}

          {!loading && !error && (
            <>
              {/* License info */}
              {data?.license && (
                <motion.div variants={fadeUp} className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-[var(--accent)]">
                    <Certificate size={14} weight="duotone" />
                    {data.license.course_id === "waterslide-safety" ? "Waterslide Safety & Competency" : data.license.course_id}
                    {" - "}
                    {data.license.used_seats}/{data.license.total_seats} seats used
                  </div>
                </motion.div>
              )}

              {/* Stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                <div className="card-shell">
                  <div className="card-core p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Users size={20} weight="duotone" className="text-[var(--accent)]" />
                      </div>
                      <p className="text-sm text-stone-400">Team Members</p>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-stone-900">
                      {mounted ? totalMembers : "-"}
                    </p>
                  </div>
                </div>
                <div className="card-shell">
                  <div className="card-core p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <CheckCircle size={20} weight="duotone" className="text-emerald-600" />
                      </div>
                      <p className="text-sm text-stone-400">Certified</p>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-stone-900">
                      {mounted ? certified : "-"}
                    </p>
                  </div>
                </div>
                <div className="card-shell">
                  <div className="card-core p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <ChartBar size={20} weight="duotone" className="text-amber-600" />
                      </div>
                      <p className="text-sm text-stone-400">Avg. Progress</p>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-stone-900">
                      {mounted ? `${avgProgress}%` : "-"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Team table */}
              <motion.div variants={fadeUp}>
                <div className="card-shell">
                  <div className="card-core">
                    <div className="p-6 border-b border-stone-100/80">
                      <h2 className="text-lg font-bold tracking-tight text-stone-800">
                        Team Members
                      </h2>
                    </div>
                    {totalMembers === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                          <Users size={24} weight="duotone" className="text-stone-400" />
                        </div>
                        <p className="text-stone-500 font-medium mb-1">No team members yet</p>
                        <p className="text-sm text-stone-400 max-w-[35ch] mx-auto">
                          Once your team is set up and members are invited, their progress will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-50">
                        {/* Table header */}
                        <div className="px-6 py-3 grid grid-cols-12 gap-4 text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                          <div className="col-span-4">Member</div>
                          <div className="col-span-3">Progress</div>
                          <div className="col-span-2">Modules</div>
                          <div className="col-span-3">Status</div>
                        </div>
                        {members.map((member) => (
                          <div key={member.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-stone-700">{member.name}</p>
                                {member.role === "admin" && (
                                  <Crown size={12} weight="fill" className="text-amber-500" />
                                )}
                              </div>
                              <p className="text-xs text-stone-400">{member.email}</p>
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                              <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[var(--accent)]"
                                  style={{ width: `${member.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-stone-500">{member.progress}%</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-sm text-stone-500">{member.completedModules}/9</span>
                            </div>
                            <div className="col-span-3">
                              {member.certified ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                                  <CheckCircle size={12} weight="fill" /> Certified
                                </span>
                              ) : member.progress > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[var(--accent)] text-xs font-medium">
                                  <Clock size={12} /> In Progress
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">
                                  Not Started
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
