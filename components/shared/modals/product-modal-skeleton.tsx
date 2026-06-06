import { Skeleton } from "@/components/ui/skeleton";

export function ProductModalSkeleton() {
  return (
    <div className="flex min-h-[500px] w-full animate-pulse">
      <Skeleton className="h-[500px] min-w-[570px] shrink-0 rounded-none" />
      <div className="flex w-[490px] flex-col gap-4 bg-[#f7f6f5] p-7">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-auto h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
