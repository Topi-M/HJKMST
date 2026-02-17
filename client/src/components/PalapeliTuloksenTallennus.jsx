export const tallennaTulos = async (usedTimeMs) => {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  const storageKey = Object.keys(localStorage).find(
    (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
  );
  const sessionData = storageKey ? JSON.parse(localStorage.getItem(storageKey)) : null;
  const token = sessionData?.access_token || anonKey;

  try {
    // 1. Haetaan kirjautuneen käyttäjän tiedot (tarvitaan user_id)
   
    const userResp = await fetch(`${baseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    });

    if (!userResp.ok) {
      return { success: false, message: "Kirjaudu sisään tallentaaksesi tuloksen." };
    }

    const userData = await userResp.json();
    const currentUserId = userData.id; // Tämä on se UUID 'user_id' sarakkeeseen

    console.log("Lähetettävä ID:", currentUserId);
    console.log("Käytettävä Token:", token.substring(0, 10) + "...");

    // 2. Tallennetaan tulos submission-tauluun
    // Sarakkeet kuvakaappauksestasi: minigame_id, solve_time_ms, user_id
    const saveResp = await fetch(`${baseUrl}/rest/v1/submission`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        minigame_id: 1,           // Palapelin ID
        solve_time_ms: usedTimeMs, // Aika millisekunteina
        user_id: currentUserId    // Linkitys käyttäjään
      }),
    });

    const result = await saveResp.json();
    console.log("Tallennus onnistui:", result);

    if (saveResp.ok) {
      return { success: true, data: result };
    } else {
      throw new Error(result.message || "Tallennus epäonnistui");
    }
  } catch (err) {
    console.error("Virhe tallennusprosessissa:", err);
    return { success: false, error: err.message };
  }
};