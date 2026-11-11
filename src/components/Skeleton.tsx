interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <span
      className={`bg-gray-200 animate-pulse rounded inline-block ${className}`}
    />
  );
}