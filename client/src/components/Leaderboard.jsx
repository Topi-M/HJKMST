import '../css/leaderboard.css';
import React, { useState, useEffect, useMemo } from "react";
import {supabase} from './SupaBaseClient';



/**
 * Leaderboard komponentti
 * Parametrit:
 *  - table = viewin nimi tietokannassa, pitää olla muodossa 'viewin nimi', eli stringinä
 *  - difficullty, usestate sivulla joka pitää muistissa minkä vaikeusasteen käyttäjä on valinnut
 *  - time_conversion (TRUE/FALSE) jos true, muuttaa scoren millisekunnit -> sekunneiksi
 *  - format, minkälainen painike leaderboardissa on, voi lisätä jos tarvitsee lisää, päivitä listaa jos lisäät:
 *    - raw -> Ei tee mitään, jos tietokannassa difficulty on Easy, Medium, Hard painikkeet ovat Easy, Medium, Hard
 *    - scale -> jos Tietokannassa on 3, 5, 6 painikkeet ovat 3x3, 5x5, 6x6
 * State:
 *  - entires (array) pitää muistissa db:stä haetun viewin
 *  - loading (TRUE/FALSE) pitää muistissa onko lataamassa
 *  - errorMsg (String) jos tulee errori haun aikana, pitää sen muistissa
 *  - selectedDifficulty (String) Tällä hetkellä valittu vaikeusaste
 *  - difficulties (List) Lista vaikeusasteista jotka näkyy viewissä -> luo painikkeet joilla voidaan filtteröidä
 *    mitä käyttäjä scoreja näkyy leaderboardissa
 * 
 * Mitä komponentti tekee:
 * 1. Hakee supabasesta table = "viewi nimi" nimisen viewin (tai taulu toimii)
 * 2. Luo painikkeet viewissä olleiden vaikeusasteiden avulla (Ei tarvitse hard coodata)
 * 3. Filtteröi difficulty staten avulla, näyttääkö minkä vaikeusasteen käyttäjälle
 * 4. Muokkaa millisekunnit sekunneiksi jos time_conversion = TRUE
 * 
 * 
 */

export default function Leaderboard({table, difficulty, time_conversion, format = 'raw'}) {
  const [entries, setEntries] = useState([]); // Kaikki haut db:stä tietty viewi
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDifficulty, setDifficulty] = useState(difficulty);
  const [difficulties, setDifficulties] = useState([]);

  const formatTime = (ms, time_conversion = false) => {
  if (ms == null || isNaN(ms)) return "—";
  return time_conversion ? `${(Number(ms) / 1000).toFixed(2)} s` :`${ms}` ;
};

  // Kaikki haut 
useEffect(() => {
  let mounted = true;

  async function fetchLeaderboard() {
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.from(table).select();
      if (error) throw error;
      if (!mounted) return;

      const list = (Array.isArray(data) ? data : []).map((row) => ({
        name: row.username,
        scoreMs: row.best_time,
        rank: row.rank,
        difficulty: row.difficulty,
      }));

      // Extract unique difficulties from the fetched data
      const uniqueDifficulties = Array.from(
        new Set(list.map((row) => row.difficulty))
      ).sort((a, b) => a - b); 

      if (mounted) {
        setEntries(list);
        setDifficulties(uniqueDifficulties); // <-- Muistiin vaikeudet, niiden kautta luodaan filtteri painikkeet
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      if (mounted) setErrorMsg(err.message || "Virhe haettaessa leaderboardia.");
    } finally {
      if (mounted) setLoading(false);
    }
  }

  fetchLeaderboard();
  return () => { mounted = false; };
  }, [table]);

  // Frontend filteri vaikeuden perusteella (Ei tarvitse hakea backendistä jos haluaa vain nähdä eri vaikeuden)
  const filteredEntries = entries.filter((e) => e.difficulty === selectedDifficulty);

  const BUTTON_FORMATS = {
  raw: (size) => size,
  scale: (size) => `${size}×${size}`
};
return (
  
    <div className="leaderboard">
      <h4 className="title">Leaderboard</h4>

      {/* Filtteri painikkeet */}
      <div className="buttons">
        {difficulties.map((size) => (
          <button
            key={size}
            className={`button ${selectedDifficulty === size ? "active" : ""}`}
            aria-pressed={selectedDifficulty === size}
            onClick={() => setDifficulty(size)}
          >
            {BUTTON_FORMATS[format](size)}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && <div className="empty">Ladataan…</div>}
      {errorMsg && <div className="empty" style={{ color: "crimson" }}>{errorMsg}</div>}

      {/* Entries list */}
      {!loading && !errorMsg && (
        <div className="list">
          {filteredEntries.length === 0 ? (
            <div className="empty">Ei tuloksia vielä…</div>
          ) : (
            filteredEntries.map((e, idx) => (
              <div key={`${e.name}-${idx}`} className="entry">
                <span className="name">{idx + 1}. {e.name}</span>
                <span className="score">{formatTime(e.scoreMs, time_conversion)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

