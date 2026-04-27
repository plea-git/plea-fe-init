import { Skeleton } from '@/shared/ui/skeleton';

// 리스트 페이지용 스켈레톤
export function ListSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="border-b px-5">
        <div className="m-auto flex h-14 w-full max-w-[1200px] items-center">
          <Skeleton className="h-8 w-[120px]" />
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1 px-5">
        <div className="m-auto w-full max-w-[1200px] space-y-4 py-7.5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </main>

      {/* Footer skeleton */}
      <div className="border-t px-5">
        <div className="m-auto w-full max-w-[1200px] py-4">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

// 폼 페이지용 스켈레톤 (등록/수정)
export function FormSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="border-b px-5">
        <div className="m-auto flex h-14 w-full max-w-[1200px] items-center">
          <Skeleton className="h-8 w-[120px]" />
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1 px-5">
        <div className="m-auto w-full max-w-[640px] space-y-6 py-7.5">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <div className="border-t px-5">
        <div className="m-auto w-full max-w-[1200px] py-4">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

// 상세 페이지용 스켈레톤
export function DetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <div className="border-b px-5">
        <div className="m-auto flex h-14 w-full max-w-[1200px] items-center">
          <Skeleton className="h-8 w-[120px]" />
        </div>
      </div>

      {/* Content skeleton */}
      <main className="flex-1 px-5">
        <div className="m-auto w-full max-w-[1200px] space-y-6 py-7.5">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-3">
            <div className="flex border-b py-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="ml-8 h-5 w-64" />
            </div>
            <div className="flex border-b py-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="ml-8 h-5 w-48" />
            </div>
            <div className="flex border-b py-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="ml-8 h-5 w-56" />
            </div>
            <div className="flex border-b py-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="ml-8 h-5 w-40" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <div className="border-t px-5">
        <div className="m-auto w-full max-w-[1200px] py-4">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}
