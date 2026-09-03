"use client";

import { useMemo } from "react";
import {
  APPLICATIONS,
  EVENTS,
  TODAY,
  countsFor,
  formatDay,
  needsAttentionOf,
  recentOf,
  type Application,
} from "./data";
import { capturedToApplication, capturedToEvent, useCaptured } from "./useCaptured";
import { useAppliedJobs } from "./useJobState";

const sameCompany = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * The dataset every screen reads: the seeded applications, refreshed by
 * anything the capture flow saved, then moved on by anything marked as
 * applied.
 *
 * A capture of a company already in the list updates that row rather than
 * adding a second one - a company you already track is the same journey,
 * not a new one.
 */
export function useApplications() {
  const captured = useCaptured();
  const jobStates = useAppliedJobs();

  return useMemo(() => {
    let applications: Application[] = [...APPLICATIONS];
    const extraEvents = [];

    for (const job of captured) {
      const fresh = capturedToApplication(job);
      const i = applications.findIndex((a) => sameCompany(a.company, job.company));

      if (i >= 0) {
        // keep the existing id so job links and calendar events still resolve
        applications[i] = { ...applications[i], ...fresh, id: applications[i].id };
      } else {
        applications = [fresh, ...applications];
        const ev = capturedToEvent(job);
        if (ev) extraEvents.push(ev);
      }
    }

    applications = applications.map((a) => {
      const state = jobStates[a.id];
      if (!state?.applied) return a;

      // an email placED read can move the status on its own, unless the
      // student said the read was wrong
      if (state.inferred && state.decision !== "corrected") {
        return {
          ...a,
          role: `${a.role.split(" · ")[0]} · ${state.appliedWith}`,
          stage: "Shortlisted",
          bucket: "inprocess",
          priority: "medium",
          needsAttention: state.decision !== "kept",
          meta:
            state.decision === "kept"
              ? "Shortlisted 16 Aug · you confirmed this"
              : "Shortlisted 16 Aug · check this one",
          recent: { meta: "Shortlisted · detected from email", priority: "medium" as const },
        };
      }

      // applying is a real move: out of Saved, out of Needs attention
      return {
        ...a,
        // the role line carries "not applied yet" until it is applied
        role: `${a.role.split(" · ")[0]} · ${state.appliedWith}`,
        stage: "Applied",
        bucket: "inprocess",
        priority: "medium",
        needsAttention: false,
        meta: `Applied ${formatDay(TODAY).slice(4)} · watching for a reply`,
        recent: { meta: `Applied with ${state.appliedWith}`, priority: "medium" as const },
      };
    });

    const events = [...extraEvents, ...EVENTS];

    return {
      applications,
      events,
      counts: countsFor(applications),
      needsAttention: needsAttentionOf(applications),
      recent: recentOf(applications),
      capturedCount: captured.length,
    };
  }, [captured, jobStates]);
}
