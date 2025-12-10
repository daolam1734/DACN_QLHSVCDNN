export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Chào mừng đến với DA QLHSVC
        </h1>
        <p className="text-center text-lg mb-4">
          Next.js với TypeScript và Tailwind CSS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Frontend</h2>
            <p className="text-gray-600">React components với TypeScript</p>
          </div>
          <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Backend</h2>
            <p className="text-gray-600">API Routes với Next.js</p>
          </div>
        </div>
      </div>
    </main>
  );
}
