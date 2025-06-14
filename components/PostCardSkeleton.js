export default function PostCardSkeleton() {
  return (
    <article className="py-6 last:border-none animate-pulse">
      <div className="h-6 bg-gray-200 mb-2 w-3/4 rounded"></div>
      <div className="h-4 bg-gray-200 mb-4 w-1/4 rounded"></div>
      <div className="h-4 bg-gray-200 mb-2 w-full rounded"></div>
      <div className="h-4 bg-gray-200 mb-2 w-5/6 rounded"></div>
      <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
    </article>
  );
}
