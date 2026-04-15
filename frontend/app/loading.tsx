import SkeletonCard from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div>
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-50 bg-white shadow-nav">
        <div className="h-1 primary-gradient" />
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-3">
          <div className="h-9 w-9 rounded-xl shimmer" />
          <div className="h-6 w-24 rounded-lg shimmer" />
          <div className="mx-3 h-10 flex-1 max-w-2xl rounded-xl shimmer" />
          <div className="h-9 w-20 rounded-xl shimmer" />
        </div>
        <div className="border-t border-border-color">
          <div className="mx-auto flex max-w-[1440px] gap-3 px-6 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 w-20 rounded-lg shimmer" />
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-[1440px] px-6 py-5">
        <div className="mb-4 h-4 w-40 rounded-lg shimmer" />
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <aside className="hidden w-[250px] flex-shrink-0 lg:block">
            <div className="rounded-2xl border border-border-color bg-white p-5 shadow-soft">
              <div className="h-6 w-16 rounded-lg shimmer mb-4" />
              <div className="space-y-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 rounded-lg shimmer" />
                ))}
              </div>
              <div className="mt-5 h-5 w-20 rounded-lg shimmer" />
              <div className="mt-3 space-y-2">
                <div className="h-4 rounded-lg shimmer" />
                <div className="h-4 rounded-lg shimmer" />
              </div>
            </div>
          </aside>

          {/* Product grid skeleton */}
          <main className="flex-1">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-border-color bg-white p-4 shadow-soft">
              <div className="space-y-2">
                <div className="h-5 w-28 rounded-lg shimmer" />
                <div className="h-4 w-44 rounded-lg shimmer" />
              </div>
              <div className="h-9 w-40 rounded-xl shimmer" />
            </div>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
