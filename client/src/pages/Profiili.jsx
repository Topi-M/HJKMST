import "../css/profiili.css";
import React, { useEffect, useState } from "react";
import { supabase } from "../components/SupaBaseClient";
import { Link } from "react-router-dom";

/**
 * Näyttää pelisuoritusten määrän kun on kirjatunut
 */
export default function Profiili() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [stats, setStats] = useState({
        palapeli: 0, sudoku: 0, nonogram: 0, whiteTiles: 0,
    });
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setErrorMsg("");

            try {
                // 1) Hae sessio
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                const user = session?.user ?? null;
                if (!user) {
                    if (mounted) {
                        setLoggedIn(false);
                        setStats({ palapeli: 0, sudoku: 0, nonogram: 0, whiteTiles: 0 });
                    }
                    return;
                }

                // 2) Hae profiili_tilastot -näkymästä kaikki countit
                const { data, error } = await supabase
                    .from("profiili_tilastot")
                    .select("palapeli_submission_count, sudoku_submission_count, nonogram_submission_count, white_tiles_submission_count")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (error) throw error;

                if (mounted) {
                    setLoggedIn(true);
                    setStats({
                        palapeli: data?.palapeli_submission_count ?? 0,
                        sudoku: data?.sudoku_submission_count ?? 0,
                        nonogram: data?.nonogram_submission_count ?? 0,
                        whiteTiles: data?.white_tiles_submission_count ?? 0,
                    });
                }
            } catch (e) {
                console.error("Profiili-sivun latausvirhe:", e);
                if (mounted) {
                    setErrorMsg(e.message || "Tietojen hakeminen epäonnistui.");
                    setLoggedIn(false);
                    setStats({ palapeli: 0, sudoku: 0, nonogram: 0, whiteTiles: 0 });
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();

        // Päivitä näkymä myös auth-tilan muuttuessa
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                setLoggedIn(false);
                setStats({ palapeli: 0, sudoku: 0, nonogram: 0, whiteTiles: 0 });
            } else {
                (async () => {
                    try {
                        setLoading(true);
                        const { data, error } = await supabase
                            .from("profiili_tilastot")
                            .select("palapeli_submission_count, sudoku_submission_count, nonogram_submission_count, white_tiles_submission_count")
                            .eq("user_id", session.user.id)
                            .maybeSingle();
                        if (error) throw error;
                        setLoggedIn(true);
                        setStats({
                            palapeli: data?.palapeli_submission_count ?? 0,
                            sudoku: data?.sudoku_submission_count ?? 0,
                            nonogram: data?.nonogram_submission_count ?? 0,
                            whiteTiles: data?.white_tiles_submission_count ?? 0,
                        });
                    } catch (e) {
                        console.error(e);
                        setErrorMsg(e.message || "Tietojen hakeminen epäonnistui.");
                        setLoggedIn(false);
                        setStats({ palapeli: 0, sudoku: 0, nonogram: 0, whiteTiles: 0 });
                    } finally {
                        setLoading(false);
                    }
                })();
            }
        });

        return () => {
            mounted = false;
            sub.subscription?.unsubscribe?.();
        };
    }, []);

    return (
        <>
            <div className="tausta">
                <div className="profiili-content">
                    <h2 className="profiili-title">Profiili</h2>

                    {/* Lataus */}
                    {loading && <div className="profiili-loading">Haetaan tietoja…</div>}

                    {/* Virhe */}
                    {!loading && !!errorMsg && (
                        <div className="profiili-error">{errorMsg}</div>
                    )}

                    {/* Ei kirjautunut */}
                    {!loading && !loggedIn && !errorMsg && (
                        <div className="profiili-guest">
                            <p>
                                <Link to="/login" className="profiili-loginLink">
                                    Kirjaudu sisään
                                </Link>{" "}
                                nähdäksesi profiilisi tilastot.
                            </p>
                        </div>
                    )}

                    {/* Kirjautunut */}
                    {!loading && loggedIn && !errorMsg && (
                        <div className="profiili-statsCard">
                            <div className="profiili-statsRow">
                                <span className="profiili-statsLabel">Palapelejä ratkaistu yhteensä:</span>
                                <span className="profiili-statsValue">{stats.palapeli}</span>
                            </div>
                            <div className="profiili-statsRow">
                                <span className="profiili-statsLabel">Sudokuja ratkaistu yhteensä:</span>
                                <span className="profiili-statsValue">{stats.sudoku}</span>
                            </div>
                            <div className="profiili-statsRow">
                                <span className="profiili-statsLabel">Nonogrammeja ratkaistu yhteensä:</span>
                                <span className="profiili-statsValue">{stats.nonogram}</span>
                            </div>
                            <div className="profiili-statsRow">
                                <span className="profiili-statsLabel">Don't Tap the White tiles pelejä pelattu</span>
                                <span className="profiili-statsValue">{stats.whiteTiles}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}