import { useState } from "react";
import "../css/colorgame.css";

/**
 * Dialed.gg tyyppinen värimuistipeli
 */

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

export default function Colorgame() {
  const [hue, setHue] = useState(180);
  const [sat, setSat] = useState(50);
  const [bri, setBri] = useState(50);

  // Saturation-sliderin gradientti: harmaasta täyteen väriin nykyisellä hue/brightness -arvolla
  const satGradient = `linear-gradient(to right, ${rgbString(hue, 0, bri)}, ${rgbString(hue, 100, bri)})`;
  // Brightness-sliderin gradientti: mustasta täyteen kirkkauteen nykyisellä hue/saturation -arvolla
  const briGradient = `linear-gradient(to right, ${rgbString(hue, sat, 0)}, ${rgbString(hue, sat, 100)})`;

  const currentColor = rgbString(hue, sat, bri);

  return (
    <div className="cg-shell">
      <div className="cg-content">
        <div className="cg-title-panel">
          <h2 className="cg-title">Väripeli</h2>
        </div>

        <div className="cg-preview" style={{ background: currentColor }} />

        <div className="cg-sliders">
          <div className="cg-slider-row">
            <label className="cg-slider-label">Sävy</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="cg-slider cg-slider--hue"
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
            />
            <span className="cg-slider-value">{bri}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
