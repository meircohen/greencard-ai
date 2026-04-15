"use client";

import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error to Sentry
  Sentry.captureException(error);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="max-w-md space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Something went wrong
              </h1>
              <p className="mt-2 text-slate-600">
                We've been notified about this error and are working to fix it.
              </p>
            </div>

            {error.digest && (
              <p className="text-sm font-mono text-slate-500">
                Error ID: {error.digest}
              </p>
            )}

            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Try again
              </button>
              <a
                href="/"
                className="block rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-900 transition-colors hover:bg-slate-50"
              >
                Go to homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
