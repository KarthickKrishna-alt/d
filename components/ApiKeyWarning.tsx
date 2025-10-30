'use client';

export default function ApiKeyWarning() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 p-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <svg
          className="h-6 w-6 shrink-0 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-500">
            TMDB API Key Required
          </h3>
          <p className="mt-2 text-gray-300">
            To use this application, you need to configure your TMDB API key.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-500">1.</span>
              <span>
                Get a free API key from{' '}
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  TMDB Settings
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-500">2.</span>
              <span>Create a <code className="rounded bg-gray-800 px-1 py-0.5">.env.local</code> file in the root directory</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-500">3.</span>
              <span>
                Add your key:{' '}
                <code className="mt-1 block rounded bg-gray-800 px-2 py-1">
                  NEXT_PUBLIC_TMDB_API_KEY=your_key_here
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-500">4.</span>
              <span>Restart the development server</span>
            </li>
          </ol>
          <p className="mt-4 text-xs text-gray-500">
            See <code>SETUP.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
