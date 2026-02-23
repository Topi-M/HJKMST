import "../css/palapeli.css";
import React, { useState, useEffect } from "react";

export default function PalapeliLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // leaderboard-koko: 3x3 / 5x5 / 7x7
  const [selectedSize, setSelectedSize] = useState(3);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  const formatMsToSec = (ms) => {
    if (!ms || isNaN(ms)) return "—";
    return (ms / 1000).toFixed(2) + " s";
  };

  useEffect(() => {
    let mounted = true;

    async function fetchTop10() {
      setLoading(true);
      setErrorMsg("");

      try {
        if (!baseUrl || !anonKey) {
          throw new Error("SUPABASE URL tai PUBLISHABLE KEY puuttuu.");
        }

        const table = "minigame1_leaderboard";

        const url = new URL(`${baseUrl}/rest/v1/${table}`);

        // *** OIKEAT SARAKKEET ***
        url.searchParams.set("select", "username,best_time,rank,grid_size");

        // Suodata valitun palapeliko'on mukaan
        url.searchParams.set("grid_size", `eq.${selectedSize}`);

        // Järjestä nopeimmasta hitaimpaan
        url.searchParams.set("order", "best_time.asc");

        // Max 25 tulosta
        url.searchParams.set("limit", "25");

        const resp = await fetch(url.toString(), {
          method: "GET",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Prefer: "count=exact"
          }
        });

        if (!resp.ok) {
          const text = await resp.text().catch(() => "");
          throw new Error(`REST error ${resp.status}: ${text}`);
        }

        const data = await resp.json();
        if (!mounted) return;

        const list = data.map((row) => ({
          name: row.username,
          scoreMs: row.best_time,
          rank: row.rank
        }));

        setEntries(list);

      } catch (err) {
        if (mounted) setErrorMsg(err.message || "Virhe ladattaessa leaderboardia.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTop10();
    return () => {
      mounted = false;
    };
  }, [selectedSize, baseUrl, anonKey]);

  return (
    <div className="leaderboard-container">
      <h4 className="leaderboard-title">Leaderboard</h4>

      {/* Koko valinnat */}
      <div className="leaderboard-size-buttons">
        <button
          className={`lbSizeBtn ${selectedSize === 3 ? "active" : ""}`}
          aria-pressed={selectedSize === 3}
          onClick={() => setSelectedSize(3)}
        >
          3×3
        </button>
        <button
          className={`lbSizeBtn ${selectedSize === 5 ? "active" : ""}`}
          aria-pressed={selectedSize === 5}
          onClick={() => setSelectedSize(5)}
        >
          5×5
        </button>
        <button
          className={`lbSizeBtn ${selectedSize === 7 ? "active" : ""}`}
          aria-pressed={selectedSize === 7}
          onClick={() => setSelectedSize(7)}
        >
          7×7
        </button>
      </div>

      {loading && <div className="leaderboard-empty">Ladataan…</div>}
      {errorMsg && (
        <div className="leaderboard-empty" style={{ color: "crimson" }}>
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="leaderboard-list">
          {entries.length === 0 ? (
            <div className="leaderboard-empty">
              Ei tuloksia
            </div>
          ) : (
            entries.map((e, idx) => (
              <div key={idx} className="leaderboard-entry">
                <span className="leaderboard-name">
                  {idx + 1}. {e.name}
                </span>
                <span className="leaderboard-score">
                  {formatMsToSec(e.scoreMs)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}