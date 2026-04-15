export default function SkeletonCard({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 rounded-2xl border border-border-color bg-white p-4 shadow-soft">
        <div className="h-40 w-40 flex-shrink-0 rounded-xl shimmer" />
        <div className="flex flex-1 flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded-md shimmer" />
            <div className="h-5 w-4/5 rounded-md shimmer" />
            <div className="h-4 w-2/3 rounded-md shimmer" />
            <div className="h-4 w-24 rounded-md shimmer" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-7 w-20 rounded-md shimmer" />
            <div className="h-10 w-28 rounded-xl shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-color bg-white shadow-soft">
      <div className="aspect-square shimmer" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-16 rounded-md shimmer" />
        <div className="h-4 w-full rounded-md shimmer" />
        <div className="h-4 w-3/4 rounded-md shimmer" />
        <div className="flex items-center gap-1">
          <div className="h-3.5 w-20 rounded-md shimmer" />
        </div>
        <div className="h-6 w-20 rounded-md shimmer" />
        <div className="h-3 w-16 rounded-md shimmer" />
        <div className="h-10 w-full rounded-xl shimmer" />
      </div>
    </div>
  );
}
