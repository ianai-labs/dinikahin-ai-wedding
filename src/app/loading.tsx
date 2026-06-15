import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      {/* Header skeleton */}
      <div className="h-16 border-b border-border flex items-center px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32" />
        <div className="hidden md:flex ml-auto gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-16 w-full max-w-xl" />
            <Skeleton className="h-16 w-3/4 max-w-lg" />
            <Skeleton className="h-5 w-96" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-48 rounded-xl" />
              <Skeleton className="h-14 w-40 rounded-xl" />
            </div>
          </div>
          <div className="flex-1">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
