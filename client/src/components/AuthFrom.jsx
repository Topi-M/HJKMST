import React, { useState } from "react";

export default function AuthForm({ supabase, setError }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // new username state
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      // Login still uses email + password
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      // Signup with metadata
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // store username in user_metadata
        },
      });

      if (error) setError(error.message);
      else alert("Signup successful! Check your email if confirmation is required.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => setMode("login")}
          disabled={mode === "login"}
          style={{ marginRight: "10px" }}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          disabled={mode === "signup"}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        {/* Show username input only on signup */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}