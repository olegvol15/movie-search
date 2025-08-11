import { useEffect, useState } from "react";

export default function AuthModal({ open, onClose, onEmail, onGoogle, busy }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setEmail(""); setError(""); }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setError("Enter a valid email");
      return;
    }
    try { await onEmail(trimmed); } catch (err) { setError(err?.message || "Failed to send link"); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold tracking-tight">Sign in</h3>
            <p className="text-sm text-gray-600 mt-1">Use a magic link or Google to sign in.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-black/10"
                disabled={busy}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full px-4 py-3 rounded-xl bg-black text-white disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send magic link"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex-1 h-px bg-gray-200" /> OR <span className="flex-1 h-px bg-gray-200" />
            </div>

            {/* <button
              onClick={onGoogle}
              disabled={busy}
              className="w-full px-4 py-3 rounded-xl border bg-white shadow-sm hover:shadow disabled:opacity-50"
            >
              Continue with Google
            </button> */}

            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-2 rounded-xl border bg-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}