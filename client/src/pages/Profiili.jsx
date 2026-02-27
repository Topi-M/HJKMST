import "../css/profiili.css";
import React, { useEffect, useState } from "react";
import { supabase } from "../components/SupaBaseClient";
import { Link } from "react-router-dom";

export default function Profiili() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [submissionCount, setSubmissionCount] = useState(0);
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
                        setSubmissionCount(0);
                    }
                    return;
                }

                // 2) Hae profiili_tilastot -näkymästä oma count (minigame_id=1)
                const { data, error } = await supabase
                    .from("profiili_tilastot")
                    .select("palapeli_submission_count")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (error) throw error;

                const count = data?.palapeli_submission_count ?? 0;

                if (mounted) {
                    setLoggedIn(true);
                    setSubmissionCount(count);
                }
            } catch (e) {
                console.error("Profiili-sivun latausvirhe:", e);
                if (mounted) {
                    setErrorMsg(e.message || "Tietojen hakeminen epäonnistui.");
                    setLoggedIn(false);
                    setSubmissionCount(0);
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
                setSubmissionCount(0);
            } else {
                (async () => {
                    try {
                        setLoading(true);
                        const { data, error } = await supabase
                            .from("profiili_tilastot")
                            .select("palapeli_submission_count")
                            .eq("user_id", session.user.id)
                            .maybeSingle();
                        if (error) throw error;
                        setLoggedIn(true);
                        setSubmissionCount(data?.palapeli_submission_count ?? 0);
                    } catch (e) {
                        console.error(e);
                        setErrorMsg(e.message || "Tietojen hakeminen epäonnistui.");
                        setLoggedIn(false);
                        setSubmissionCount(0);
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
                            <span className="profiili-statsLabel">Palapelejä ratkaistu yhteensä:</span>
                            <span className="profiili-statsValue">{submissionCount}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}