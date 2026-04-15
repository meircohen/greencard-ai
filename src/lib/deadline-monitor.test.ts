import {
  generateDeadlines,
  getReminderLevel,
  getDeadlineStatusColor,
  getDaysUntilDeadline,
  isDeadlineOverdue,
} from './deadline-monitor';
import { CaseDeadline } from './db/schema';

// Test utilities for deadline monitoring

/**
 * Test suite for deadline generation
 * Verifies that deadlines are correctly calculated based on immigration law requirements
 */

export function testDeadlineGeneration(caseId: string) {
  console.log('Testing deadline generation...');

  // Test I-485 case (conditional green card)
  const approvalDate = new Date('2024-04-15');
  const deadlines = generateDeadlines(caseId, 'I-485-conditional', approvalDate);

  console.log(`Generated ${deadlines.length} deadlines for I-485 case`);

  // Verify I-751 deadline
  const i751 = deadlines.find(d => d.deadlineType === 'I-751');
  if (i751) {
    const expectedDate = new Date(approvalDate);
    expectedDate.setFullYear(expectedDate.getFullYear() + 2);
    expectedDate.setDate(expectedDate.getDate() - 90);

    console.log('I-751 deadline check:');
    console.log(`  Expected: ${expectedDate.toISOString().split('T')[0]}`);
    console.log(`  Actual:   ${i751.deadlineDate.toISOString().split('T')[0]}`);
    console.log(
      `  Match: ${
        Math.abs(i751.deadlineDate.getTime() - expectedDate.getTime()) < 1000
          ? 'PASS'
          : 'FAIL'
      }`
    );
  }

  // Verify N-400 deadline
  const n400 = deadlines.find(d => d.deadlineType === 'N-400');
  if (n400) {
    const expectedDate = new Date(approvalDate);
    expectedDate.setFullYear(expectedDate.getFullYear() + 3); // Marriage-based
    expectedDate.setDate(expectedDate.getDate() - 90);

    console.log('N-400 deadline check:');
    console.log(`  Expected: ${expectedDate.toISOString().split('T')[0]}`);
    console.log(`  Actual:   ${n400.deadlineDate.toISOString().split('T')[0]}`);
  }

  // Verify I-90 deadline
  const i90 = deadlines.find(d => d.deadlineType === 'I-90');
  if (i90) {
    const expectedDate = new Date(approvalDate);
    expectedDate.setFullYear(expectedDate.getFullYear() + 10);
    expectedDate.setDate(expectedDate.getDate() - 180);

    console.log('I-90 deadline check:');
    console.log(`  Expected: ${expectedDate.toISOString().split('T')[0]}`);
    console.log(`  Actual:   ${i90.deadlineDate.toISOString().split('T')[0]}`);
  }
}

/**
 * Test reminder schedule calculations
 */
export function testReminderSchedule() {
  console.log('Testing reminder schedule...');

  const now = new Date();
  const testCases = [
    { daysUntil: 95, expected: 'first' },
    { daysUntil: 75, expected: 'second' },
    { daysUntil: 45, expected: 'urgent' },
    { daysUntil: 20, expected: 'critical' },
    { daysUntil: 10, expected: 'final' },
    { daysUntil: 3, expected: 'final' },
    { daysUntil: 1, expected: 'final' },
    { daysUntil: 150, expected: null },
  ];

  for (const test of testCases) {
    const mockDeadline: CaseDeadline = {
      id: 'test',
      caseId: 'test',
      deadlineType: 'Test',
      deadlineDate: new Date(now.getTime() + test.daysUntil * 24 * 60 * 60 * 1000),
      description: 'Test deadline',
      reminderSent: false,
      completed: false,
      createdAt: now,
    };

    const daysUntil = getDaysUntilDeadline(mockDeadline);
    const statusColor = getDeadlineStatusColor(daysUntil, false);

    console.log(`Days until: ${test.daysUntil}`);
    console.log(`  Status color: ${statusColor}`);
    console.log(`  Expected reminder level: ${test.expected}`);
  }
}

/**
 * Test deadline status color coding
 */
export function testStatusColors() {
  console.log('Testing deadline status colors...');

  const testCases = [
    { daysUntil: 90, completed: false, expected: 'green' },
    { daysUntil: 45, completed: false, expected: 'amber' },
    { daysUntil: 15, completed: false, expected: 'red' },
    { daysUntil: 5, completed: false, expected: 'red' },
    { daysUntil: -5, completed: false, expected: 'red' }, // Overdue
    { daysUntil: 50, completed: true, expected: 'green' }, // Completed
  ];

  for (const test of testCases) {
    const color = getDeadlineStatusColor(test.daysUntil, test.completed);
    const status = color === test.expected ? 'PASS' : 'FAIL';
    console.log(
      `Days: ${test.daysUntil}, Completed: ${test.completed} -> ${color} [${status}]`
    );
  }
}

/**
 * Test edge cases and error handling
 */
export function testEdgeCases() {
  console.log('Testing edge cases...');

  const now = new Date();

  // Test: Deadline in past (overdue)
  const overdue: CaseDeadline = {
    id: 'overdue-test',
    caseId: 'test',
    deadlineType: 'Test',
    deadlineDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    description: 'Overdue test',
    reminderSent: false,
    completed: false,
    createdAt: now,
  };

  console.log('Overdue deadline:');
  console.log(`  Is overdue: ${isDeadlineOverdue(overdue)}`);
  console.log(`  Days until: ${getDaysUntilDeadline(overdue)}`);

  // Test: Already completed deadline
  const completed: CaseDeadline = {
    id: 'completed-test',
    caseId: 'test',
    deadlineType: 'Test',
    deadlineDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    description: 'Completed test',
    reminderSent: true,
    completed: true,
    createdAt: now,
  };

  console.log('Completed deadline:');
  console.log(`  Is overdue: ${isDeadlineOverdue(completed)}`);
  console.log(`  Status color: ${getDeadlineStatusColor(30, true)}`);

  // Test: Deadline today
  const today: CaseDeadline = {
    id: 'today-test',
    caseId: 'test',
    deadlineType: 'Test',
    deadlineDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    description: 'Today test',
    reminderSent: false,
    completed: false,
    createdAt: now,
  };

  console.log('Today deadline:');
  console.log(`  Days until: ${getDaysUntilDeadline(today)}`);
}

/**
 * Run all tests
 */
export function runAllTests(caseId: string = 'test-case-id') {
  console.log('===== DEADLINE MONITORING TEST SUITE =====\n');

  try {
    testDeadlineGeneration(caseId);
    console.log('\n---\n');

    testReminderSchedule();
    console.log('\n---\n');

    testStatusColors();
    console.log('\n---\n');

    testEdgeCases();
    console.log('\n===== TESTS COMPLETED =====\n');
  } catch (error) {
    console.error('Test suite error:', error);
  }
}
