export default function OfflinePage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">You’re offline</h1>
        <p className="mt-2 text-sm opacity-80">
          No internet connection. Core pages and cached content still work.
        </p>
      </div>
    </main>
  );
}
