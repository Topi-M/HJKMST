import React, { useEffect, useMemo, useState } from "react";

export default function PalapeliKuvaValinta({
  visible,
  onClose,
  onSelect,
  bucket = "kuvat",
  prefix = "",
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(visible);
  const [error, setError] = useState(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  const normPrefix = useMemo(() => {
    if (!prefix) return "";
    return prefix.endsWith("/") ? prefix : `${prefix}/`;
  }, [prefix]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setError(null);

    async function listImages() {
      try {
        if (!supabaseUrl || !anonKey) {
          throw new Error("Supabase URL tai ANON KEY puuttuu (.env.local).");
        }

        const listUrl = `${supabaseUrl}/storage/v1/object/list/${encodeURIComponent(bucket)}`;
        console.log("List URL:", listUrl, "prefix:", normPrefix);

        const resp = await fetch(listUrl, {
          method: "POST",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prefix: normPrefix, // tärkeä: "" juureen, ei "/"
            limit: 1000,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          }),
        });

        const text = await resp.text();
        if (!resp.ok) {
          let hint = "";
          if (resp.status === 401 || resp.status === 403) {
            hint = " (Tarkista Storage-politiikat tai File listing -asetus bucketille)";
          }
          throw new Error(`Storage list failed: ${resp.status} ${text}${hint}`);
        }

        let data = [];
        try { data = JSON.parse(text); } catch { data = []; }

        const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
        const files = data.filter(
          (f) =>
            !f.metadata?.isDirectory &&
            typeof f.name === "string" &&
            allowed.some((ext) => f.name.toLowerCase().endsWith(ext))
        );

        const urls = files.map(
          (f) =>
            `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(
              bucket
            )}/${normPrefix}${encodeURIComponent(f.name)}`
        );

        setImages(urls);
      } catch (e) {
        console.error(e);
        setError(e.message || "Virhe kuvien latauksessa");
      } finally {
        setLoading(false);
      }
    }

    listImages();
  }, [visible, supabaseUrl, anonKey, bucket, normPrefix]);

  if (!visible) return null;

  return (
    <div className="kuva-modal-overlay" onClick={onClose}>
      <div className="kuva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kuva-modal-header">
          <span>Valitse kuva</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {loading && <div style={{ padding: 12 }}>Ladataan kuvia…</div>}
        {error && <div style={{ color: "crimson", padding: 12 }}>{error}</div>}
        {!loading && !error && (
          <div className="kuva-grid">
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                className="kuva-thumb"
                alt={`Kuva ${idx + 1}`}
                onClick={() => onSelect(url)}
                loading="lazy"
              />
            ))}
            {images.length === 0 && (
              <div style={{ padding: 12, color: "#555" }}>
                Ei kuvia kansiossa: <code>{normPrefix || "/"}</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}