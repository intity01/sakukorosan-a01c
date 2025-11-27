import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

function TimerSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-border/50">
        <Skeleton className="h-8 w-48 mx-auto" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Title Skeleton */}
        <Skeleton className="h-9 w-64 mb-6" />

        {/* Mode Buttons Skeleton */}
        <div className="flex gap-2 mb-10">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Timer Circle Skeleton */}
        <Skeleton className="w-80 h-80 rounded-full mb-8" />

        {/* Task Card Skeleton */}
        <Skeleton className="h-12 w-80 rounded-2xl" />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <Skeleton className="h-8 w-48 mx-auto" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Filter & Add Button */}
        <div className="flex gap-3 mb-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Task List */}
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function ProgressSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <Skeleton className="h-8 w-48 mx-auto" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <Skeleton className="h-8 w-48 mx-auto" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>

        {/* Week Chart */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-48 rounded-xl" />
        </div>

        {/* Category Stats */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton, TimerSkeleton, DashboardSkeleton, ProgressSkeleton, StatsSkeleton }

