import React, { useEffect, useRef } from "react";

const HealthRadar = ({ dataPoints = [85, 70, 90, 65, 80] }) => {
  const canvasRef = useRef(null);

  const labels    = ["CARDIO", "NUTRITION", "SLEEP", "FOCUS", "NEURAL"];
  const colors    = ["#f43f5e", "#10b981", "#6366f1", "#f59e0b", "#06b6d4"];
  const icons     = ["❤️", "🍏", "💤", "🧠", "⚡"];
  const values    = dataPoints.slice(0, 5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const W      = canvas.width;
    const H      = canvas.height;
    const cx     = W / 2;
    const cy     = H / 2 - 10;
    const R      = Math.min(W, H) * 0.32;
    const sides  = 5;
    let frame;
    let progress = 0;

    const angleOffset = -Math.PI / 2;
    const angle = (i) => angleOffset + (2 * Math.PI * i) / sides;

    const getPoint = (i, r) => ({
      x: cx + r * Math.cos(angle(i)),
      y: cy + r * Math.sin(angle(i)),
    });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── GRID RINGS ──
      [0.2, 0.4, 0.6, 0.8, 1.0].forEach((t, ri) => {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const p = getPoint(i, R * t);
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(148,163,184,${ri === 4 ? 0.15 : 0.07})`;
        ctx.lineWidth   = ri === 4 ? 1 : 0.8;
        ctx.stroke();

        // ring label
        if (ri < 4) {
          ctx.fillStyle = "rgba(148,163,184,0.35)";
          ctx.font      = "bold 8px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`${(t * 100).toFixed(0)}`, cx, cy - R * t + 4);
        }
      });

      // ── SPOKES ──
      for (let i = 0; i < sides; i++) {
        const p = getPoint(i, R);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(148,163,184,0.1)";
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // ── DATA POLYGON (animated) ──
      const animValues = values.map(v => v * Math.min(progress, 1));

      // Glow fill
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const r = R * (animValues[i] / 100);
        const p = getPoint(i, r);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      grad.addColorStop(0, "rgba(99,102,241,0.35)");
      grad.addColorStop(0.6, "rgba(6,182,212,0.20)");
      grad.addColorStop(1, "rgba(6,182,212,0.05)");
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const r = R * (animValues[i] / 100);
        const p = getPoint(i, r);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      const strokeGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      strokeGrad.addColorStop(0, "#6366f1");
      strokeGrad.addColorStop(0.5, "#06b6d4");
      strokeGrad.addColorStop(1, "#10b981");
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth   = 2.5;
      ctx.shadowColor = "rgba(6,182,212,0.5)";
      ctx.shadowBlur  = 12;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // ── VERTEX DOTS ──
      for (let i = 0; i < sides; i++) {
        const r = R * (animValues[i] / 100);
        const p = getPoint(i, r);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.shadowColor = colors[i];
        ctx.shadowBlur  = 10;
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      // ── AXIS LABELS ──
      for (let i = 0; i < sides; i++) {
        const p     = getPoint(i, R + 32);
        const val   = values[i];
        const color = colors[i];

        ctx.font      = `bold 10px Arial`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${icons[i]} ${labels[i]}`, p.x, p.y - 6);

        // value badge
        ctx.font      = `bold 13px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(`${val}%`, p.x, p.y + 9);
      }
    };

    const animate = () => {
      if (progress < 1) {
        progress += 0.025;
        draw();
        frame = requestAnimationFrame(animate);
      } else {
        progress = 1;
        draw();
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [dataPoints]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <canvas ref={canvasRef} width={400} height={360} style={{ maxWidth: "100%", maxHeight: "100%" }} />

      {/* ── Value bars row ── */}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px", width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
        {labels.map((l, i) => (
          <div key={i} style={{ flex: "1", minWidth: "60px", maxWidth: "90px", background: "rgba(255,255,255,0.03)", border: `1px solid ${colors[i]}33`, borderRadius: "10px", padding: "6px 8px", textAlign: "center" }}>
            <div style={{ fontSize: "16px", marginBottom: "2px" }}>{icons[i]}</div>
            <div style={{ fontSize: "9px", color: colors[i], fontWeight: 800, letterSpacing: "1px", marginBottom: "3px" }}>{l}</div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${values[i]}%`, background: colors[i], borderRadius: "100px", boxShadow: `0 0 6px ${colors[i]}` }} />
            </div>
            <div style={{ fontSize: "11px", color: "#e2e8f0", fontWeight: 900, marginTop: "3px" }}>{values[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRadar;
