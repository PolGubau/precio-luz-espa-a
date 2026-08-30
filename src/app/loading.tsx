export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="flex gap-2">
        <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-8 w-28 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="h-16 animate-pulse rounded-xl bg-slate-100" key={item} />
        ))}
      </div>
    </main>
  );
}