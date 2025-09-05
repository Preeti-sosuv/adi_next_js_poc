export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          Welcome to ADI
        </h1>
        <h2 className="text-2xl text-gray-600 mb-8">
          Next.js Proof of Concept
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl">
          This is a modern Next.js application built with TypeScript, Redux Toolkit for state management, and Tailwind CSS for styling.
        </p>
        <div className="mt-8">
          <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg">
            🚀 Ready to build amazing things!
          </div>
        </div>
      </div>
    </main>
  )
}