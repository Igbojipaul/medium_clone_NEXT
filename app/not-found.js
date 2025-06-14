export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found.</p>
      <a href="/" className="text-gray-600 hover:underline">
        Go home
      </a>
    </main>
  );
}
