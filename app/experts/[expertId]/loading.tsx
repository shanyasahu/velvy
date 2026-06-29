export default function Loading() {
  return (
    <div className="min-h-screen bg-(--bg-primary) pb-32 lg:pb-12">
      <div className="mx-auto max-w-[1600px] animate-pulse space-y-4 px-4 py-4 lg:space-y-5 lg:px-6 lg:py-6">
        {/* Filter bar */}
        <div className="hidden h-16 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) lg:block" />

        <div className="lg:flex lg:gap-6">
          {/* Left categories sidebar */}
          <div className="hidden w-[220px] shrink-0 space-y-4 lg:block">
            <div className="h-[420px] rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
            <div className="h-36 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
            <div className="h-40 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 h-8 w-36 rounded-full bg-(--bg-card)" />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-[300px_minmax(0,1fr)]">
                  <div className="aspect-[4/5] rounded-[var(--radius-md)] bg-(--bg-card)" />
                  <div className="space-y-3">
                    <div className="h-7 w-2/3 rounded-full bg-(--bg-card)" />
                    <div className="h-4 w-1/3 rounded-full bg-(--bg-card)" />
                    <div className="h-20 w-full rounded-xl bg-(--bg-card)" />
                    <div className="h-11 w-full rounded-xl bg-(--bg-card)" />
                  </div>
                </div>
                <div className="h-24 rounded-[var(--radius-md)] bg-(--bg-card)" />
                <div className="h-28 rounded-[var(--radius-md)] bg-(--bg-card)" />
                <div className="h-64 rounded-[var(--radius-md)] bg-(--bg-card)" />
              </div>

              <div className="hidden h-[640px] rounded-[var(--radius-md)] bg-(--bg-card) xl:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
