import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

import AuthForm from "../components/AuthFrom";
import ErrorMessage from "../components/ErrorMessage";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

export default function AuthPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      }
    });

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    else {
      setUser(null);
      navigate("/"); // redirect to homepage or login
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
