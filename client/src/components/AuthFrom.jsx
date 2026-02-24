import React, { useState } from "react";

export default function AuthForm({ supabase, setError }) {
  const [mode, setMode] = useState("login"); // "login" / "signup"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // uusi käyttäjänimi, vain signupissa
  const [password, setPassword] = useState(""); // salasanana input
  const [loading, setLoading] = useState(false);


  // Log in moodi -> kutsuu signInWithPassword() auth db:stä -> jos OK päästää sisään -> tulee session token
  // Muuten -> signup -> luodaan tili, tällä hetkellä (12.2.2026) sähköpostia jolla tarkistetaan email EI lähetetä, vaikka niin sanotaan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      // Login käyttää email + password
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      // Signup  metadata = käyttäjänimi
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // ´käyttäjänimi user_metadataan
        },
      });

      if (error) setError(error.message);
    }

    setLoading(false);
  };
  // formeja ja user inputtia
  return (
    <div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => setMode("login")}
          disabled={mode === "login"}
          className={`authSwitchBtn ${mode === "login" ? "active" : ""}`}
        >
          Kirjaudu
        </button>

        <button
          onClick={() => setMode("signup")}
          disabled={mode === "signup"}
          className={`authSwitchBtn ${mode === "signup" ? "active" : ""}`}
        >
          Luo tili
        </button>
      </div>

      <form aria-label="auth form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {/* Show username input only on signup */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Käyttäjätunnus"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        )}

        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          className="authSubmitBtn"
        >
          {loading ? "Loading..." : mode === "login" ? "Kirjaudu" : "Luo tili"}
        </button>

      </form>
    </div>
  );
}