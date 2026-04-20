import { useState, useEffect } from "react";
import "../css/colorgame.css";

/**
 * Dialed.gg tyyppinen värimuistipeli
 */

// Tavoitevärien taulukko (HSB). Pelin alussa tästä arvotaan yksi väri.
const TARGET_COLORS = [
  { h: 10, s: 85, b: 90 },   // punainen
  { h: 30, s: 90, b: 95 },   // oranssi
  { h: 50, s: 95, b: 95 },   // keltainen
  { h: 90, s: 75, b: 80 },   // limenvihreä
  { h: 135, s: 70, b: 55 },  // tummanvihreä
  { h: 175, s: 80, b: 85 },  // turkoosi
  { h: 210, s: 85, b: 70 },  // sininen
  { h: 255, s: 70, b: 65 },  // indigo
  { h: 290, s: 75, b: 75 },  // violetti
  { h: 330, s: 80, b: 85 },  // pinkki
];

const SHOW_DURATION = 5;

// Muuntaa HSB (HSV) -arvot RGB-arvoiksi väri-esikatselua varten.
function hsbToRgb(h, s, b) {
  const sN = s / 100;
  const vN = b / 100;
  const c = vN * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vN - c;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function rgbString(h, s, b) {
  const [r, g, bl] = hsbToRgb(h, s, b);
  return `rgb(${r}, ${g}, ${bl})`;
}

// Laskee pistemäärän 0-100 vertaamalla pelaajan HSB-arvoja tavoiteväriin.
// Sävy on ympyrä (0-360), joten erotus lasketaan lyhyintä etäisyyttä myöten.
function calcScore(target, guess) {
  const hueDiffRaw = Math.abs(target.h - guess.h);
  const hueDiff = Math.min(hueDiffRaw, 360 - hueDiffRaw) / 180;
  const satDiff = Math.abs(target.s - guess.s) / 100;
  const briDiff = Math.abs(target.b - guess.b) / 100;
  const total = (hueDiff + satDiff + briDiff) / 3;
  return Math.round((1 - total) * 100);
}

export default function Colorgame() {
  const [hue, setHue] = useState(180);
  const [sat, setSat] = useState(50);
  const [bri, setBri] = useState(50);
  const [phase, setPhase] = useState("idle"); // idle | showing | guessing | result
  const [target, setTarget] = useState(null);
  const [showTime, setShowTime] = useState(SHOW_DURATION);
  const [finalScore, setFinalScore] = useState(null);

  // Saturation-sliderin gradientti: harmaasta täyteen väriin nykyisellä hue/brightness -arvolla
  const satGradient = `linear-gradient(to right, ${rgbString(hue, 0, bri)}, ${rgbString(hue, 100, bri)})`;
  // Brightness-sliderin gradientti: mustasta täyteen kirkkauteen nykyisellä hue/saturation -arvolla
  const briGradient = `linear-gradient(to right, ${rgbString(hue, sat, 0)}, ${rgbString(hue, sat, 100)})`;

  const currentColor = rgbString(hue, sat, bri);

  // Lähtölaskenta tavoitevärin näyttämiselle (100ms välein, näytetään yhdellä desimaalilla)
  useEffect(() => {
    if (phase !== "showing") return;
    if (showTime <= 0) {
      setPhase("guessing");
      return;
    }
    const id = setTimeout(() => setShowTime(t => Math.max(0, +(t - 0.1).toFixed(1))), 100);
    return () => clearTimeout(id);
  }, [phase, showTime]);

  function handleStart() {
    const t = TARGET_COLORS[Math.floor(Math.random() * TARGET_COLORS.length)];
    setTarget(t);
    setHue(180);
    setSat(50);
    setBri(50);
    setShowTime(SHOW_DURATION);
    setFinalScore(null);
    setPhase("showing");
  }

  function handleSubmit() {
    const score = calcScore(target, { h: hue, s: sat, b: bri });
    setFinalScore(score);
    setPhase("result");
  }

  const slidersDisabled = phase !== "guessing";

  // Esikatselun väri eri vaiheissa
  let previewColor = "#000";
  if (phase === "showing") previewColor = rgbString(target.h, target.s, target.b);
  else if (phase === "guessing") previewColor = currentColor;

  return (
    <div className="cg-shell">
      <div className="cg-content">
        <div className="cg-title-panel">
          <h2 className="cg-title">Väripeli</h2>
        </div>

        {/* Esikatselualue / tulosalue */}
        {phase === "result" ? (
          <div className="cg-result-area">
            <div className="cg-result-split">
              <div className="cg-result-half" style={{ background: rgbString(target.h, target.s, target.b) }}>
                <span className="cg-result-label">Tavoite</span>
              </div>
              <div className="cg-result-half" style={{ background: currentColor }}>
                <span className="cg-result-label">Sinun</span>
              </div>
            </div>
            <div className="cg-score">Pisteet: {finalScore} / 100</div>
          </div>
        ) : (
          <div className="cg-preview-wrap">
            <div className="cg-preview" style={{ background: previewColor }} />
            {phase === "idle" && (
              <div className="cg-idle-overlay">
                <div className="cg-instructions">
                  <p>Paina mieleen annettu väri</p>
                  <p>5s jälkeen luo se käyttäen sävy- kylläisyys- ja kirkkausvalitsimia</p>
                </div>
                <button className="cg-start-btn" onClick={handleStart}>Aloita</button>
              </div>
            )}
            {phase === "showing" && (
              <div className="cg-countdown">{showTime.toFixed(1)}</div>
            )}
          </div>
        )}

        {/* Sliderit */}
        <div className={`cg-sliders${slidersDisabled ? " cg-sliders--disabled" : ""}`}>
          <div className="cg-slider-row">
            <label className="cg-slider-label">Sävy</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="cg-slider cg-slider--hue"
              disabled={slidersDisabled}
            />
            <span className="cg-slider-value">{hue}</span>
          </div>

          <div className="cg-slider-row">
            <label className="cg-slider-label">Kylläisyys</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sat}
              onChange={(e) => setSat(Number(e.target.value))}
              className="cg-slider"
              style={{ background: satGradient }}
              disabled={slidersDisabled}
            />
            <span className="cg-slider-value">{sat}</span>
          </div>

          <div className="cg-slider-row">
            <label className="cg-slider-label">Kirkkaus</label>
            <input
              type="range"
              min="0"
              max="100"
              value={bri}
              onChange={(e) => setBri(Number(e.target.value))}
              className="cg-slider"
              style={{ background: briGradient }}
              disabled={slidersDisabled}
            />
            <span className="cg-slider-value">{bri}</span>
          </div>
        </div>

        {/* Valmis / Uusi peli -nappi */}
        {phase === "guessing" && (
          <button className="cg-submit-btn" onClick={handleSubmit}>Valmis</button>
        )}
        {phase === "result" && (
          <button className="cg-submit-btn" onClick={handleStart}>Uusi peli</button>
        )}
      </div>
    </div>
  );
}
