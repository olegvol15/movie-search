import Home from './pages/Home.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">🎬 Movie Search</h1>
          <a className="text-sm underline" href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Home />
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-gray-500">
        Built with React • Vite • Tailwind
      </footer>
    </div>
  )
}
