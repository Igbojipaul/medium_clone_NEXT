export default function Spinner({ size = 6 }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-gray-600 h-${size} w-${size}`}></div>
  );
}
