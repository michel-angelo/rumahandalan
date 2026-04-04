export default function PromoLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="w-full bg-bg-page border-b border-text-primary/8 py-4 px-5 flex justify-center sticky top-0 z-40">
        <div className="h-7 w-32 bg-bg-surface animate-pulse" />
      </div>

      {/* Hero skeleton */}
      <div className="w-full h-[70svh] min-h-[480px] max-h-[700px] bg-bg-surface animate-pulse" />

      {/* Urgency bar skeleton */}
      <div className="bg-text-primary/10 py-3 px-5 h-10 animate-pulse" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 flex flex-col gap-14">
        {/* Scarcity bar */}
        <div className="border border-text-primary/10 bg-bg-surface h-24 animate-pulse" />

        {/* Gallery */}
        <div className="aspect-[4/3] w-full bg-bg-surface animate-pulse -mx-5 sm:mx-0" />

        {/* Social proof */}
        <div className="border-y border-text-primary/10 py-7 grid grid-cols-3 gap-px">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-3">
              <div className="h-8 w-10 bg-bg-surface animate-pulse" />
              <div className="h-3 w-16 bg-bg-surface animate-pulse" />
            </div>
          ))}
        </div>

        {/* Price box */}
        <div className="bg-bg-surface border border-text-primary/10 p-8 flex flex-col items-center gap-4">
          <div className="h-4 w-24 bg-bg-page animate-pulse" />
          <div className="h-12 w-48 bg-bg-page animate-pulse" />
          <div className="h-14 w-full sm:w-64 bg-bg-page animate-pulse mt-4" />
        </div>

        {/* Spec grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-text-primary/10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-bg-page py-7 px-4 flex flex-col items-center gap-2"
            >
              <div className="h-8 w-10 bg-bg-surface animate-pulse" />
              <div className="h-3 w-16 bg-bg-surface animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA skeleton */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-bg-page border-t border-text-primary/10 p-4 flex justify-end">
        <div className="h-14 w-full sm:w-56 bg-bg-surface animate-pulse" />
      </div>
    </>
  );
}
