"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import * as uscisData from "@/lib/uscis-data";

interface FormTiming {
  formNumber: string;
  label: string;
  rangeWeeks: string;
  midpointDays: number;
  filedDate?: string; // ISO date string
}

function parseRange(range: string): { min: number; max: number } {
  const parts = range.match(/(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)/);
  if (parts) return { min: parseFloat(parts[1]), max: parseFloat(parts[2]) };
  const single = parseFloat(range);
  return { min: single || 0, max: single || 0 };
}

function daysFromRange(range: string, unit: "weeks" | "days" = "weeks"): number {
  const { min, max } = parseRange(range);
  const mid = (min + max) / 2;
  return unit === "weeks" ? Math.round(mid * 7) : Math.round(mid);
}

function formatDuration(totalDays: number): string {
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0 || parts.length === 0) parts.push(`${days}d`);
  return parts.join(" ");
}

function getFormTimings(): FormTiming[] {
  return [
    {
      formNumber: "I-130",
      label: "Family Petition",
      rangeWeeks: uscisData.processingTimes["I-130"].range,
      midpointDays: daysFromRange(uscisData.processingTimes["I-130"].range),
    },
    {
      formNumber: "I-140",
      label: "Employment Petition",
      rangeWeeks: uscisData.processingTimes["I-140"].range,
      midpointDays: daysFromRange(uscisData.processingTimes["I-140"].range),
    },
    {
      formNumber: "I-485",
      label: "Adjustment of Status",
      rangeWeeks: uscisData.processingTimes["I-485"].range,
      midpointDays: daysFromRange(uscisData.processingTimes["I-485"].range),
    },
    {
      formNumber: "I-765",
      label: "Work Authorization",
      rangeWeeks: uscisData.processingTimes["I-765"].range,
      midpointDays: daysFromRange(uscisData.processingTimes["I-765"].range, "days"),
    },
  ];
}

interface ClockDisplayProps {
  timing: FormTiming;
  filedDate?: Date | null;
}

function ClockDisplay({ timing, filedDate }: ClockDisplayProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const daysPassed = filedDate
    ? Math.floor((now.getTime() - filedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const progress = filedDate
    ? Math.min(100, Math.round((daysPassed / timing.midpointDays) * 100))
    : 0;

  const daysRemaining = filedDate ? Math.max(0, timing.midpointDays - daysPassed) : timing.midpointDays;

  const estimatedDate = filedDate
    ? new Date(filedDate.getTime() + timing.midpointDays * 24 * 60 * 60 * 1000)
    : null;

  // Ring calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const progressColor =
    progress < 50 ? "text-green-400" : progress < 80 ? "text-amber-400" : "text-red-400";

  return (
    <Card className="p-6">
      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="6"
              className="fill-none stroke-surface/50"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`fill-none stroke-current ${progressColor} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-primary">{progress}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-primary">{timing.formNumber}</h4>
            <Badge variant="gray" className="text-[10px]">{timing.label}</Badge>
          </div>
          <p className="text-xs text-muted mb-3">
            Processing: {timing.rangeWeeks} {timing.formNumber === "I-765" ? "days" : "weeks"}
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {filedDate && (
              <div>
                <p className="text-[10px] text-muted">Filed</p>
                <p className="text-sm text-primary">{filedDate.toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] text-muted">Est. Wait</p>
              <p className="text-sm text-primary">{formatDuration(timing.midpointDays)}</p>
            </div>
            {filedDate && (
              <>
                <div>
                  <p className="text-[10px] text-muted">Days Passed</p>
                  <p className="text-sm text-primary">{daysPassed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Est. Decision</p>
                  <p className="text-sm text-green-400 font-medium">
                    {estimatedDate?.toLocaleDateString() || "N/A"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface BacklogClockProps {
  filedDates?: Record<string, string>; // formNumber -> ISO date
}

export default function BacklogClock({ filedDates = {} }: BacklogClockProps) {
  const timings = useMemo(() => getFormTimings(), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-green-400" />
        <h3 className="text-lg font-semibold text-primary">Processing Backlog Clock</h3>
      </div>
      <p className="text-sm text-secondary mb-6">
        Real-time view of USCIS processing times. Add your filing dates to track your personal wait.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timings.map((timing) => (
          <ClockDisplay
            key={timing.formNumber}
            timing={timing}
            filedDate={filedDates[timing.formNumber] ? new Date(filedDates[timing.formNumber]) : null}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted mt-4">
        Data sourced from USCIS processing time estimates. Actual processing may vary.
        Last updated: {uscisData.visaBulletin.lastUpdated}
      </p>
    </div>
  );
}
