export default function Unauthorized() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
      <p className="mb-6">You must be logged in to view this page.</p>
      <a href="/login" className="text-gray-600 hover:underline">
        Sign In
      </a>
    </main>
  );
}
