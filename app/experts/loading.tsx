export default function Loading() {
  return (
    <div className="min-h-screen bg-(--bg-primary) pb-24 lg:pb-10">
      <div className="mx-auto max-w-[1600px] animate-pulse space-y-4 px-3 py-4 lg:space-y-5 lg:px-6 lg:py-6">
        {/* Toolbar */}
        <div className="hidden h-14 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) lg:block" />

        <div className="lg:flex lg:gap-6">
          {/* Top categories sidebar */}
          <div className="hidden w-[200px] shrink-0 space-y-4 lg:block">
            <div className="h-80 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
            <div className="h-48 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
          </div>

          {/* Sub categories sidebar */}
          <div className="hidden w-[240px] shrink-0 2xl:block">
            <div className="h-[540px] rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)" />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-6">
            <div className="hidden h-20 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) lg:block" />
            <div className="h-44 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) lg:hidden" />

            {[0, 1].map((row) => (
              <div key={row} className="space-y-3">
                <div className="h-5 w-40 rounded-full bg-(--bg-card)" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 lg:gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-56 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card)"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
