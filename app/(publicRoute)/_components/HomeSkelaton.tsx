import { SkeletonCard } from "@/components/shared/skeletonCard";

export const HomeSkeleton = () => {
  const count = 10;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};