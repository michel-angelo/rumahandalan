export default function LoadingProperties() {
  return (
    <div className="bg-bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* ── HEADER SKELETON ── */}
        <div className="mb-16 animate-pulse">
          {/* Label Kecil */}
          <div className="w-32 h-3 bg-text-primary/10 mb-3"></div>
          {/* Judul Besar */}
          <div className="w-64 md:w-96 h-12 md:h-14 bg-text-primary/10 mb-4"></div>
          {/* Deskripsi */}
          <div className="max-w-xl flex flex-col gap-2">
            <div className="w-full h-4 bg-text-primary/10"></div>
            <div className="w-5/6 h-4 bg-text-primary/10"></div>
          </div>
        </div>

        {/* ── GRID CARD CLUSTER SKELETON ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="relative block aspect-square bg-bg-surface overflow-hidden border border-text-primary/5 animate-pulse"
            >
              {/* Info Cluster Skeleton (posisi di bawah kotak) */}
              <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col gap-3">
                {/* Label Promo Skeleton */}
                <div className="w-24 h-5 bg-text-primary/10"></div>
                {/* Nama Cluster Skeleton */}
                <div className="w-2/3 h-8 bg-text-primary/10 mb-1"></div>
                {/* Nama Developer Skeleton */}
                <div className="w-1/3 h-3 bg-text-primary/10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
