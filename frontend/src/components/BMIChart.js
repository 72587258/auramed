import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

// ── Plugin: draw horizontal BMI zone bands ──
const bmiZonePlugin = {
  id: "bmiZones",
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;
    const { left, right, top, bottom } = chartArea;
    const yScale = scales.y;
    if (!yScale) return;

    const zones = [
      { min: 0,    max: 18.5, color: "rgba(6,182,212,0.07)",  label: "Underweight" },
      { min: 18.5, max: 25,   color: "rgba(16,185,129,0.09)", label: "Normal" },
      { min: 25,   max: 30,   color: "rgba(245,158,11,0.08)", label: "Overweight" },
      { min: 30,   max: 50,   color: "rgba(239,68,68,0.07)",  label: "Obese" },
    ];

    zones.forEach(({ min, max, color, label }) => {
      const yTop    = yScale.getPixelForValue(max);
      const yBottom = yScale.getPixelForValue(min);
      if (yTop > bottom || yBottom < top) return;
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(left, Math.max(yTop, top), right - left, Math.min(yBottom, bottom) - Math.max(yTop, top));
      ctx.font = "bold 9px Arial";
      ctx.fillStyle = color.replace("0.0", "0.5").replace("0.07","0.4").replace("0.09","0.4").replace("0.08","0.4");
      ctx.textAlign = "right";
      ctx.fillText(label, right - 6, Math.max(yTop, top) + 12);
      ctx.restore();
    });
  }
};

ChartJS.register(bmiZonePlugin);

const BMIChart = ({ records = [] }) => {
  const safeRecords = Array.isArray(records) ? [...records].reverse() : [];

  const labels = safeRecords.length > 0
    ? safeRecords.map((r, i) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `#${i + 1}`)
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const datasetData = safeRecords.length > 0
    ? safeRecords.map(r => parseFloat(r.bmi) || 0)
    : [21.5, 22.1, 21.8, 22.5, 23.0, 22.7];

  // Color each point based on BMI zone
  const pointColors = datasetData.map(v =>
    v < 18.5 ? "#06b6d4" : v < 25 ? "#10b981" : v < 30 ? "#f59e0b" : "#ef4444"
  );

  const data = {
    labels,
    datasets: [
      {
        label: "BMI",
        data: datasetData,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(99,102,241,0.35)");
          gradient.addColorStop(0.5, "rgba(6,182,212,0.18)");
          gradient.addColorStop(1, "rgba(6,182,212,0.0)");
          return gradient;
        },
        borderColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "#6366f1";
          const gradient = ctx.createLinearGradient(0, 0, chartArea.right, 0);
          gradient.addColorStop(0, "#6366f1");
          gradient.addColorStop(0.5, "#06b6d4");
          gradient.addColorStop(1, "#10b981");
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: pointColors,
        pointBorderColor: "#fff",
        pointBorderWidth: 2.5,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 3,
        tension: 0.45,
      },
      // Reference line at BMI 25 (Normal upper boundary)
      {
        label: "Healthy Limit",
        data: labels.map(() => 25),
        borderColor: "rgba(16,185,129,0.4)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 10, right: 16, bottom: 4, left: 4 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(5,9,20,0.95)",
        titleColor: "#06b6d4",
        bodyColor: "#e2e8f0",
        padding: 14,
        borderColor: "rgba(99,102,241,0.4)",
        borderWidth: 1,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          title: (items) => `📅 ${items[0].label}`,
          label: (item) => {
            if (item.datasetIndex === 1) return null;
            const v = item.raw;
            const cat = v < 18.5 ? "Underweight" : v < 25 ? "✅ Normal" : v < 30 ? "⚠ Overweight" : "🔴 Obese";
            return [`BMI: ${v}`, `Status: ${cat}`];
          },
          afterLabel: () => null,
        },
        filter: item => item.datasetIndex === 0,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "rgba(148,163,184,0.7)",
          font: { size: 10, weight: "600" },
          maxRotation: 0,
        },
      },
      y: {
        min: Math.max(0, Math.min(...datasetData) - 3),
        max: Math.max(...datasetData) + 4,
        grid: {
          color: "rgba(255,255,255,0.04)",
          borderDash: [4, 4],
        },
        border: { display: false },
        ticks: {
          color: "rgba(148,163,184,0.6)",
          font: { size: 10, weight: "700" },
          callback: v => v.toFixed(1),
          stepSize: 2,
        },
      },
    },
    interaction: { mode: "index", intersect: false },
    animation: { duration: 1200, easing: "easeInOutQuart" },
  };

  // Current BMI stats
  const latest = datasetData[datasetData.length - 1];
  const prev   = datasetData[datasetData.length - 2];
  const delta  = prev != null ? (latest - prev).toFixed(1) : null;
  const latestColor = latest < 18.5 ? "#06b6d4" : latest < 25 ? "#10b981" : latest < 30 ? "#f59e0b" : "#ef4444";
  const latestLabel = latest < 18.5 ? "Underweight" : latest < 25 ? "Normal" : latest < 30 ? "Overweight" : "Obese";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ── Stat pills row ── */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ background: `${latestColor}18`, border: `1px solid ${latestColor}44`, borderRadius: "10px", padding: "6px 14px" }}>
          <p style={{ margin: 0, fontSize: "9px", color: "rgba(148,163,184,0.8)", fontWeight: 700, letterSpacing: "1.5px" }}>CURRENT BMI</p>
          <p style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: latestColor, lineHeight: 1.2 }}>{latest.toFixed(1)}</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "6px 14px" }}>
          <p style={{ margin: 0, fontSize: "9px", color: "rgba(148,163,184,0.8)", fontWeight: 700, letterSpacing: "1.5px" }}>STATUS</p>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: latestColor, lineHeight: 1.4 }}>{latestLabel}</p>
        </div>
        {delta !== null && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "6px 14px" }}>
            <p style={{ margin: 0, fontSize: "9px", color: "rgba(148,163,184,0.8)", fontWeight: 700, letterSpacing: "1.5px" }}>CHANGE</p>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: parseFloat(delta) <= 0 ? "#10b981" : "#f59e0b", lineHeight: 1.3 }}>
              {parseFloat(delta) > 0 ? "+" : ""}{delta}
            </p>
          </div>
        )}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "6px 14px" }}>
          <p style={{ margin: 0, fontSize: "9px", color: "rgba(148,163,184,0.8)", fontWeight: 700, letterSpacing: "1.5px" }}>ENTRIES</p>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: "#6366f1", lineHeight: 1.3 }}>{datasetData.length}</p>
        </div>
      </div>
      {/* ── Chart ── */}
      <div style={{ flex: 1, minHeight: "180px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default BMIChart;