'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { CaseDeadline } from '@/lib/db';
import { getDaysUntilDeadline, getDeadlineStatusColor } from '@/lib/deadline-monitor';

export interface DeadlineWidgetProps {
  deadlines: CaseDeadline[];
  compact?: boolean;
  caseId?: string;
}

interface ProcessedDeadline extends CaseDeadline {
  daysRemaining: number;
  isOverdue: boolean;
  statusColor: 'green' | 'amber' | 'red';
  formattedDate: string;
}

function processDeadlines(deadlines: CaseDeadline[]): ProcessedDeadline[] {
  const now = new Date();

  return deadlines.map(deadline => {
    const daysRemaining = getDaysUntilDeadline(deadline);
    const isOverdue = deadline.deadlineDate < now && !(deadline.completed ?? false);
    const statusColor = getDeadlineStatusColor(daysRemaining, deadline.completed ?? false);

    return {
      ...deadline,
      daysRemaining,
      isOverdue,
      statusColor,
      formattedDate: deadline.deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  });
}

function getStatusBadgeColor(
  color: 'green' | 'amber' | 'red',
  completed: boolean
): string {
  if (completed) {
    return 'bg-green-100 text-green-800 border-green-200';
  }

  switch (color) {
    case 'green':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'amber':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'red':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusIcon(color: 'green' | 'amber' | 'red', completed: boolean): string {
  if (completed) return '✓';
  if (color === 'red') return '!';
  if (color === 'amber') return '⚠';
  return '';
}

function DeadlineItem({
  deadline,
  compact = false,
}: {
  deadline: ProcessedDeadline;
  compact?: boolean;
}) {
  const icon = getStatusIcon(deadline.statusColor, deadline.completed ?? false);
  const badgeColor = getStatusBadgeColor(deadline.statusColor, deadline.completed ?? false);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
        <div className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${badgeColor}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {deadline.deadlineType}
          </div>
          <div className="text-xs text-gray-500">
            {deadline.completed ? 'Completed' : `${Math.max(0, deadline.daysRemaining)} days`}
          </div>
        </div>
        <div className="text-xs text-gray-600 text-right whitespace-nowrap">
          {deadline.formattedDate}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{deadline.deadlineType}</h4>
          {deadline.description && (
            <p className="text-sm text-gray-600 mt-1">{deadline.description}</p>
          )}
        </div>
        <div
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${badgeColor}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm">
          <span className="text-gray-600">Due: </span>
          <span className="font-medium text-gray-900">{deadline.formattedDate}</span>
        </div>
        <div className="text-right">
          {deadline.completed ? (
            <span className="text-sm font-medium text-green-700">Completed</span>
          ) : deadline.isOverdue ? (
            <span className="text-sm font-medium text-red-700">Overdue</span>
          ) : (
            <span className={`text-sm font-medium ${
              deadline.statusColor === 'red'
                ? 'text-red-700'
                : deadline.statusColor === 'amber'
                  ? 'text-amber-700'
                  : 'text-green-700'
            }`}>
              {deadline.daysRemaining} days
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function DeadlineWidget({
  deadlines,
  compact = false,
  caseId,
}: DeadlineWidgetProps) {
  const processedDeadlines = useMemo(
    () => processDeadlines(deadlines),
    [deadlines]
  );

  // Sort by days remaining (soonest first)
  const sortedDeadlines = useMemo(
    () => {
      const completed = processedDeadlines.filter(d => d.completed);
      const upcoming = processedDeadlines
        .filter(d => !d.completed)
        .sort((a, b) => a.daysRemaining - b.daysRemaining);

      return [...upcoming, ...completed];
    },
    [processedDeadlines]
  );

  // Show only upcoming deadlines in compact mode
  const displayDeadlines = compact
    ? sortedDeadlines.slice(0, 3)
    : sortedDeadlines;

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No deadlines scheduled</p>
      </div>
    );
  }

  return (
    <div>
      {compact ? (
        <div className="space-y-1">
          {displayDeadlines.map(deadline => (
            <DeadlineItem
              key={deadline.id}
              deadline={deadline}
              compact={true}
            />
          ))}
          {sortedDeadlines.length > 3 && (
            <Link
              href={caseId ? `/cases/${caseId}/deadlines` : '/deadlines'}
              className="block text-center py-2 px-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg mt-2"
            >
              View all {sortedDeadlines.length} deadlines
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayDeadlines.map(deadline => (
            <DeadlineItem
              key={deadline.id}
              deadline={deadline}
              compact={false}
            />
          ))}
        </div>
      )}

      {!compact && sortedDeadlines.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Pro tip:</strong> Set reminders for important deadlines to avoid missing critical filing windows. Missing deadlines could impact your immigration status.
          </p>
        </div>
      )}
    </div>
  );
}

// Export a summary component for dashboards
export function DeadlineSummary({
  deadlines,
}: {
  deadlines: CaseDeadline[];
}) {
  const processed = useMemo(
    () => processDeadlines(deadlines),
    [deadlines]
  );

  const now = new Date();
  const stats = {
    total: deadlines.length,
    completed: processed.filter(d => d.completed).length,
    urgent: processed.filter(
      d => !d.completed && d.daysRemaining <= 30 && d.daysRemaining > 0
    ).length,
    overdue: processed.filter(d => d.isOverdue).length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-xs text-gray-600 mt-1">Total Deadlines</div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
        <div className="text-xs text-green-700 mt-1">Completed</div>
      </div>

      {stats.urgent > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-amber-700">{stats.urgent}</div>
          <div className="text-xs text-amber-700 mt-1">Due Soon</div>
        </div>
      )}

      {stats.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
          <div className="text-xs text-red-700 mt-1">Overdue</div>
        </div>
      )}
    </div>
  );
}
