import "../css/palapeli.css";
import React, { useState, useEffect, useMemo } from "react";

export default function PalapeliLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  useEffect(() => {
    let mounted = true;

    async function fetchTop10() {
      setLoading(true);
      setErrorMsg("");

      try {
        if (!baseUrl || !anonKey) {
          throw new Error("SUPABASE URL tai ANON KEY puuttuu (.env.local).");
        }

        const table = "test_ranking";
        const url = new URL(`${baseUrl}/rest/v1/${table}`);
        url.searchParams.set("select", "Nimi,Ranking");
        url.searchParams.set("order", "Ranking.asc");
        url.searchParams.set("limit", "10");

        const resp = await fetch(url.toString(), {
          method: "GET",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Prefer: "count=exact",
          },
        });

        if (!resp.ok) {
          const text = await resp.text().catch(() => "");
          throw new Error(`REST fetch failed (${resp.status}): ${text}`);
        }

        const data = await resp.json();
        if (!mounted) return;

        const list = (Array.isArray(data) ? data : []).map((row) => ({
          name: row.Nimi,
          score: row.Ranking,
        }));

        setEntries(list);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        if (mounted) setErrorMsg(err.message || "Virhe haettaessa leaderboardia.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTop10();
    return () => {
      mounted = false;
    };
  }, [baseUrl, anonKey]);

  return (
    <div className="leaderboard-container">
      <h4 className="leaderboard-title">Leaderboard</h4>

      {loading && <div className="leaderboard-empty">Ladataan…</div>}
      {errorMsg && (
        <div className="leaderboard-empty" style={{ color: "crimson" }}>
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="leaderboard-list">
          {entries.length === 0 ? (
            <div className="leaderboard-empty">Ei tuloksia vielä…</div>
          ) : (
            entries.map((e, idx) => (
              <div key={`${e.name}-${idx}`} className="leaderboard-entry">
                <span className="leaderboard-name">
                  {idx + 1}. {e.name}
                </span>
                <span className="leaderboard-score">{e.score}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}