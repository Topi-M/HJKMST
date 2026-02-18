import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../components/SupaBaseClient";
import AuthForm from "../components/AuthFrom"; // <- komponentti joka käsittelee sign up / login / logout funktiot
import ErrorMessage from "../components/ErrorMessage"; // <- error jos jokin menee pieleen


export default function AuthPage() {
  const navigate = useNavigate(); // <- ohjaa käyttäjän toisille sivuille
  const [error, setError] = useState(""); // <- pitää muistissa errorit
  const [user, setUser] = useState(null); // <- sisäänkirjautuneen käyttäjän tiedot

  // Katsoo onko käyttäjä kirjautunut sisään
  // auth.getsessions https://supabase.com/docs/guides/auth/sessions
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      }
    });

    // Kuuntelee käyttäjän tilaa (login, logout jne) 
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  // Logout, tyhjentää user staten ja lähettää supabaselle logout funktion
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    else {
      setUser(null);
      navigate("/"); // vie takas main pagelle
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>Authentication</h2>

      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout} style={{ width: "100%" }}>
            Log Out
          </button>
        </div>
      ) : (
        <AuthForm supabase={supabase} setError={setError} />
      )}

      {error && <ErrorMessage message={error} />}
    </div>
  );
}
