import { toFaDigits, formatShort, MONTHS, parseKey } from "./shamsi.js";

export function lineChart(container, points, color, unitLabel) {
  container.innerHTML = "";
  const w = 640;
  const h = 220;
  const pad = { l: 36, r: 12, t: 16, b: 32 };
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("class", "chart");
  const vals = points.map((p) => p.value);
  const max = Math.max(1, ...vals);
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const x = (i) => pad.l + (points.length <= 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v) => pad.t + innerH - (v / max) * innerH;
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
  grid.setAttribute("d", [0.25, 0.5, 0.75, 1].map((g) => `M${pad.l} ${y(max * g)} H${w - pad.r}`).join(" "));
  grid.setAttribute("class", "grid");
  svg.appendChild(grid);
  if (points.length) {
    const d = points.map((p, i) => `${i ? "L" : "M"}${x(i)} ${y(p.value)}`).join(" ");
    const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
    area.setAttribute("d", `${d} L${x(points.length - 1)} ${pad.t + innerH} L${x(0)} ${pad.t + innerH} Z`);
    area.setAttribute("fill", color);
    area.setAttribute("opacity", "0.16");
    svg.appendChild(area);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", d);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "2.4");
    line.setAttribute("stroke-linejoin", "round");
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);
    points.forEach((p, i) => {
      if (p.value <= 0 && points.length > 8) return;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", x(i));
      c.setAttribute("cy", y(p.value));
      c.setAttribute("r", "2.4");
      c.setAttribute("fill", color);
      svg.appendChild(c);
    });
  }
  const labelEvery = points.length > 16 ? 5 : points.length > 10 ? 3 : 1;
  points.forEach((p, i) => {
    if (i % labelEvery && i !== points.length - 1) return;
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x(i));
    t.setAttribute("y", h - 8);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("class", "axis");
    t.textContent = toFaDigits(parseKey(p.date).jd);
    svg.appendChild(t);
  });
  const maxLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  maxLabel.setAttribute("x", 4);
  maxLabel.setAttribute("y", pad.t + 8);
  maxLabel.setAttribute("class", "axis");
  maxLabel.textContent = String(Math.round(max * 10) / 10);
  svg.appendChild(maxLabel);
  container.appendChild(svg);
  const cap = document.createElement("div");
  cap.className = "chart-cap";
  const sum = vals.reduce((a, b) => a + b, 0);
  cap.textContent = unitLabel(sum, max);
  container.appendChild(cap);
}

export function monthKeys(year, month) {
  const days = [];
  for (let d = 1; d <= 31; d++) days.push(`${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  return days;
}

export { MONTHS, formatShort };
