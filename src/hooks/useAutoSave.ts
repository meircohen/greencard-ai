"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AutoSaveOptions {
  /** Debounce delay in milliseconds. Default: 2000 (2 seconds). */
  delay?: number;
  /** Called with the current data when saving. Should return a promise. */
  onSave: (data: Record<string, unknown>) => Promise<void>;
  /** Whether auto-save is enabled. Default: true. */
  enabled?: boolean;
}

interface AutoSaveState {
  /** Last successful save timestamp */
  lastSaved: Date | null;
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Error from the last save attempt */
  error: string | null;
  /** Number of unsaved changes since last save */
  pendingChanges: number;
}

/**
 * Hook for auto-saving form data with debounced writes.
 *
 * Usage:
 * ```tsx
 * const { trackChange, saveNow, state } = useAutoSave({
 *   delay: 2000,
 *   onSave: async (data) => {
 *     await fetch('/api/forms/save', {
 *       method: 'PUT',
 *       body: JSON.stringify(data),
 *     });
 *   },
 * });
 *
 * // Call trackChange whenever a form field updates
 * const handleFieldChange = (field: string, value: unknown) => {
 *   setFormData(prev => ({ ...prev, [field]: value }));
 *   trackChange({ ...formData, [field]: value });
 * };
 * ```
 */
export function useAutoSave({ delay = 2000, onSave, enabled = true }: AutoSaveOptions) {
  const [state, setState] = useState<AutoSaveState>({
    lastSaved: null,
    isSaving: false,
    error: null,
    pendingChanges: 0,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDataRef = useRef<Record<string, unknown> | null>(null);
  const mountedRef = useRef(true);
  const savingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const doSave = useCallback(async () => {
    const data = latestDataRef.current;
    if (!data || savingRef.current) return;

    savingRef.current = true;
    if (mountedRef.current) {
      setState((prev) => ({ ...prev, isSaving: true, error: null }));
    }

    try {
      await onSave(data);
      if (mountedRef.current) {
        setState({
          lastSaved: new Date(),
          isSaving: false,
          error: null,
          pendingChanges: 0,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isSaving: false,
          error: err instanceof Error ? err.message : "Save failed",
        }));
      }
    } finally {
      savingRef.current = false;
    }
  }, [onSave]);

  /** Track a change and schedule a debounced save. */
  const trackChange = useCallback(
    (data: Record<string, unknown>) => {
      if (!enabled) return;

      latestDataRef.current = data;
      setState((prev) => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }));

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(doSave, delay);
    },
    [enabled, delay, doSave]
  );

  /** Force an immediate save (e.g. on blur or before navigation). */
  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    await doSave();
  }, [doSave]);

  return { trackChange, saveNow, state };
}
