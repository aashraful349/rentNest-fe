import { HomeSkeleton } from "./_components/HomeSkelaton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl mt-6 px-4 sm:px-6 lg:px-8">
      <HomeSkeleton />
    </div>
  )
}
