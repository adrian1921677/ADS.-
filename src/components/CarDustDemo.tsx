"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  /** 1 = Basis; 0.5 langsamer, 2 schneller */
  speed?: number;
  /** Markenfarben (aus eurem Logo) */
  brand?: string;      // Navy
  brandDark?: string;  // dunkleres Navy
  accent?: string;     // Rot
  /** Höhe der Bühne (z.B. '60vh' oder 500) */
  height?: number | string;
  /** HUD (Regler + Replay) ein/aus */
  showHUD?: boolean;
};

export default function CarDustDemo({
  speed = 1,
  brand = "#0C2A3A",
  brandDark = "#102538",
  accent = "#E23D3D",
  height = "70vh",
  showHUD = true,
}: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const carWrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const speedRef = useRef(speed);
  const startRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const reqRef = useRef<number | null>(null);

  // Reduced motion respektieren
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);

  // Speed live aktualisieren (HUD)
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Resize Canvas -> DevicePixelRatio berücksichtigen
  const resize = () => {
    const stage = stageRef.current, canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const dpr = Math.max(1, (window.devicePixelRatio || 1));
    const w = stage.clientWidth, h = stage.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => { resize(); }, []);
  useEffect(() => {
    const onR = () => resize();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // Partikelzustand
  type Particle = { x:number; y:number; vx:number; vy:number; life:number; age:number; size:number; hue:number; };
  const particlesRef = useRef<Particle[]>([]);

  const spawnDust = (x:number, y:number) => {
    const n = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      particlesRef.current.push({
        x, y,
        vx: -1 - Math.random()*2 - Math.random()*3, // nach hinten
        vy: -0.5 - Math.random()*1.5,
        life: 600 + Math.random()*600,
        age: 0,
        size: 2 + Math.random()*6,
        hue: 0, // grau statt rot
      });
    }
  };

  const drawParticles = (dt:number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const stage = stageRef.current;
    if (!canvas || !ctx || !stage) return;

    // leicht abdunkeln => Trail
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(12, 26, 38, .25)";
    ctx.fillRect(0, 0, stage.clientWidth, stage.clientHeight);

    // Partikel zeichnen
    ctx.globalCompositeOperation = "lighter";
    const arr = particlesRef.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.age += dt;
      p.x += p.vx * (dt/16);
      p.y += p.vy * (dt/16);
      p.vy += 0.02 * (dt/16); // leichte Gravitation

      const t = p.age / p.life;
      if (t >= 1) { arr.splice(i,1); continue; }

      const alpha = (1 - t) * 0.4;
      const r = p.size * (1 + 0.5*t);
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grd.addColorStop(0, `rgba(120,120,120,${alpha})`);
      grd.addColorStop(1, `rgba(80,80,80,0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  };

  // Easing
  const easeInOutCubic = (t:number) => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2);

  // Animation-Loop
  const duration = 8000; // ms (bei speed=1)
  const carWidth = 320;

  const reset = () => { startRef.current = null; };

  useEffect(() => {
    const stage = stageRef.current;
    const car = carWrapRef.current;
    if (!stage || !car) return;

    const groundY = () => stage.clientHeight * 0.62;
    const carYBase = () => groundY() - 116;

    const frame = (now:number) => {
      // Init
      if (startRef.current == null) startRef.current = now;
      if (lastRef.current == null) lastRef.current = now;
      const dt = now - (lastRef.current || now);
      lastRef.current = now;

      // Fortschritt
      const tNorm = Math.min(((now - (startRef.current || now)) / (duration / speedRef.current)), 1);
      const xProgress = easeInOutCubic(tNorm);
      const x = -carWidth * 0.6 + (stage.clientWidth + carWidth * 1.2) * xProgress;
      
      // Auto nur im sichtbaren Bereich zeigen (0.1 bis 0.9)
      const visibilityStart = 0.1;
      const visibilityEnd = 0.9;
      const isVisible = tNorm >= visibilityStart && tNorm <= visibilityEnd;
      
      // Animation beenden wenn Auto durch ist
      if (tNorm >= 1) {
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        return;
      }

      // „Wamm-Wamm": leichte Neigung & Hub
      const wobble = Math.sin(x * 0.03) * 4 + Math.sin(x * 0.08) * 2;
      const bumps  = Math.max(0, Math.sin(x * 0.01 - 0.6));
      const y = carYBase() + wobble - bumps * 6;
      const rot = Math.sin(x * 0.02) * 2 - bumps * 1.5;

      // Apply transform mit Sichtbarkeit
      car.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
      car.style.opacity = isVisible ? '1' : '0';

      // Staub am Hinterrad emittieren (nur wenn sichtbar)
      if (!reduced && dt < 80 && isVisible) {
        const rearWheelX = x + 110;
        const rearWheelY = y + 120;
        spawnDust(rearWheelX - 10, rearWheelY - 8);
      }

      // Canvas zeichnen
      if (!reduced) drawParticles(dt);

      reqRef.current = requestAnimationFrame(frame);
    };

    reqRef.current = requestAnimationFrame(frame);
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [reduced]);

  return (
    <div ref={stageRef} style={{ position: "relative", width: "100%", height, overflow: "hidden",
      background: `radial-gradient(80vw 50vh at 20% 20%, ${shade(brand, 0.25)} 0%, transparent 60%), 
                   radial-gradient(100vw 80vh at 80% 80%, ${shade(brand, 0.55)} 0%, transparent 65%),
                   linear-gradient(180deg, ${brand} 0%, ${brandDark} 100%)`
    }}>
      {/* Styles (scoped) */}
      <style>{`
        .ads__ground{position:absolute;left:0;right:0;bottom:14vh;height:2px;
          background:linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.25), rgba(255,255,255,.05));
          box-shadow:0 0 12px rgba(255,255,255,.08); z-index:1;}
        .ads__car{position:absolute; left:0; top:0; transform:translate3d(-30%,0,0);
          will-change:transform; z-index:2; 
          filter: drop-shadow(0 15px 30px rgba(0,0,0,.6)) 
                  drop-shadow(0 5px 15px rgba(0,0,0,.4))
                  drop-shadow(0 2px 8px rgba(0,0,0,.3))
                  brightness(1.1) contrast(1.2);}
        .ads__hud{position:absolute;left:16px;top:16px;z-index:10;
          background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);
          border-radius:14px;backdrop-filter:blur(6px);padding:10px 12px;display:flex;gap:12px;align-items:center;color:#fff;}
        .ads__hud label{font-size:12px;opacity:.95}
        .ads__hud input[type=range]{width:160px}
        .ads__hud button{appearance:none;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;
          padding:8px 10px;border-radius:10px;cursor:pointer}
        .ads__hud button:hover{background:rgba(255,255,255,.08)}
        @media (prefers-reduced-motion: reduce){ .ads__car{transition:none} canvas{display:none} }
      `}</style>

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <div className="ads__ground" />

      {/* Car + Swoosh (inline SVG) */}
      <div className="ads__car" ref={carWrapRef} aria-hidden="true">
        <svg width="320" height="160" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
          {/* Swoosh */}
          <defs>
            <linearGradient id="adsSwoosh" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={accent} stopOpacity={0.9}/>
              <stop offset="100%" stopColor={accent} stopOpacity={1}/>
            </linearGradient>
          </defs>
          <path d="M20 122 C 110 90, 190 140, 300 108 C 240 150, 130 152, 20 138 Z" fill="url(#adsSwoosh)" />
          {/* Car body */}
          <g transform="translate(0,-12)">
            <circle cx="98" cy="120" r="18" fill={brandDark}/>
            <circle cx="222" cy="120" r="18" fill={brandDark}/>
            <path d="M56 116 C 58 98, 72 84, 92 72 C 125 52, 188 52, 220 68
                     C 240 78, 258 96, 266 110 L 282 110 C 289 110, 292 114, 292 118
                     L 292 122 C 292 126, 289 129, 284 129 L 266 129
                     C 263 137, 254 142, 244 142 L 206 142 C 191 142, 176 135, 170 129
                     L 150 129 C 138 139, 128 142, 112 142 L 80 142 C 66 142, 56 134, 56 122 Z"
                  fill={brand} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <path d="M106 86 C 140 70, 188 70, 216 84 C 224 88, 234 98, 238 106
                     L 120 106 C 108 106, 100 98, 106 86 Z" fill={shade(brand, 0.35)}/>
            <ellipse cx="258" cy="114" rx="10" ry="5" fill={shade(brand, 0.55)}/>
          </g>
        </svg>
      </div>

      {showHUD && (
        <div className="ads__hud" role="region" aria-label="Animation Steuerung">
          <label htmlFor="ads-speed">Geschwindigkeit</label>
          <input
            id="ads-speed" type="range" min={0.5} max={2.0} step={0.1}
            defaultValue={speed} onInput={(e) => (speedRef.current = Number((e.target as HTMLInputElement).value))}
          />
          <button onClick={reset} title="Neu starten">↻ Replay</button>
        </div>
      )}
    </div>
  );
}

/** kleine Helper-Funktion zum Abdunkeln (0..1) */
function shade(hex: string, amt = 0.25) {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map(x => x + x).join("") : c, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  r = Math.round(r * (1 - amt)); g = Math.round(g * (1 - amt)); b = Math.round(b * (1 - amt));
  return `rgb(${r}, ${g}, ${b})`;
}
