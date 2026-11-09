import { CardTileSkeleton, ChartSkeleton, ListingSkeleton } from "@/components/Blocks";

export default function Loading() {
  return (
    <div className="container py-6" aria-busy="true" aria-label="Loading card">
      <div className="skeleton mb-6 h-4 w-64" />
      <div className="grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[180px_1fr] lg:grid-cols-[420px_1fr] lg:gap-12">
        <div className="skeleton aspect-[5/7] rounded-card" />
        <div className="space-y-3">
          <div className="skeleton h-5 w-32" /><div className="skeleton h-10 w-3/4" /><div className="skeleton h-4 w-1/2" />
          <div className="skeleton mt-6 h-12 w-48" />
          <div className="mt-6 hidden gap-2 lg:flex">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-14 w-24 rounded-xl" />)}</div>
          <div className="skeleton mt-4 hidden h-36 rounded-xl2 lg:block" />
        </div>
      </div>
      <div className="panel mt-12 p-6"><ChartSkeleton /></div>
      <div className="panel mt-8"><ListingSkeleton /></div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <CardTileSkeleton key={i} />)}</div>
    </div>
  );
}
