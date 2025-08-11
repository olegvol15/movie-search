import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./auth.jsx";

const Ctx = createContext(null);
const LS_KEY = "favorites:v1"; // offline cache when logged out

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  });

  // When user logs in: merge local → server and then load canonical list from server
  useEffect(() => {
    if (!user) return;
    (async () => {
      // 1) Load existing server rows
      const { data: serverRows, error: selErr } = await supabase
        .from("favorites")
        .select("imdb_id, title, year, poster, type")
        .order("created_at", { ascending: false });
      if (selErr) { console.error(selErr); return; }

      const serverMap = new Map((serverRows || []).map(r => [r.imdb_id, r]));

      // 2) Upload local-only entries
      for (const it of items) {
        if (!serverMap.has(it.imdbID)) {
          const { error: insErr } = await supabase.from("favorites").insert({
            user_id: user.id,
            imdb_id: it.imdbID,
            title: it.Title,
            year: it.Year,
            poster: it.Poster,
            type: it.Type,
          });
          if (insErr) console.error(insErr);
        }
      }

      // 3) Reload canonical list from server
      const { data: merged } = await supabase
        .from("favorites")
        .select("imdb_id, title, year, poster, type")
        .order("created_at", { ascending: false });
      setItems((merged || []).map(m => ({
        imdbID: m.imdb_id,
        Title: m.title,
        Year: m.year,
        Poster: m.poster,
        Type: m.type,
      })));

      // 4) Clear local cache now that server is source of truth
      localStorage.removeItem(LS_KEY);
    })();
  }, [user]);

  // Persist locally only when logged out
  useEffect(() => {
    if (!user) localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, user]);

  const ids = useMemo(() => new Set(items.map(i => i.imdbID)), [items]);
  const isFav = (id) => ids.has(id);

  async function add(movie) {
    if (isFav(movie.imdbID)) return;
    setItems(prev => [movie, ...prev]);
    if (user) {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        imdb_id: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        type: movie.Type,
      });
      if (error) console.error(error);
    }
  }

  async function remove(id) {
    setItems(prev => prev.filter(m => m.imdbID !== id));
    if (user) {
      const { error } = await supabase.from("favorites").delete().eq("imdb_id", id);
      if (error) console.error(error);
    }
  }

  function toggle(movie) { isFav(movie.imdbID) ? remove(movie.imdbID) : add(movie); }

  return (
    <Ctx.Provider value={{ items, isFav, add, remove, toggle, count: items.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}