export default function Spinner({ size = 6 }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4 mx-auto" />
        <p className="text-gray-600">Loading post...</p>
      </div>
    </div>
  );
}
