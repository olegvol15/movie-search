import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./store/auth.jsx";
import AuthModal from "./components/AuthModal.jsx";

export default function App() {
  const { user, authLoading, signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doEmail(email) {
    setBusy(true);
    try { await signInWithEmail(email); setAuthOpen(false); }
    finally { setBusy(false); }
  }
  async function doGoogle() {
    setBusy(true);
    try { await signInWithGoogle(); setAuthOpen(false); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">Movie Search</Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/favorites" className="text-sm underline hover:opacity-80">Favorites</Link>
            {!authLoading && (user ? (
              <button onClick={signOut} className="text-sm underline hover:opacity-80">
                Sign out ({user.email ?? "account"})
              </button>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="text-sm underline hover:opacity-80">Sign in</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-12 text-center text-xs text-gray-500">
        Built with React • Vite • Tailwind
      </footer>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onEmail={doEmail}
        onGoogle={doGoogle}
        busy={busy}
      />
    </div>
  );
}



