const yearly = { 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 };

const funcs = { "2025": [ ["Saúde", 0], ["Educação", 0], ["Administração", 0], ["Urbanismo", 0], ["Transporte", 0], ["Assistência Social", 0], ["Legislativa", 0], ["Encargos Especiais", 0] ], "2024": [ ["Saúde", 0], ["Educação", 0], ["Administração", 0], ["Urbanismo", 0], ["Transporte", 0], ["Assistência Social", 0], ["Legislativa", 0], ["Encargos Especiais", 0] ] };

const colors = ["#7DF3FF","#63D6C1","#FFB84C","#6B7B8C","#315784","#A8C7D8","#9FC7C0","#D0A65B"];

const fmt = (x, d = 1) => x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const money = x => "R$ " + fmt(x) + " mi";

function svgEl(tag, attrs, text) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  if (text) n.textContent = text;
  return n;
}

function renderBars(year) {
  const svg = document.querySelector("#barChart");
  const data = funcs[year] || [];
  const total = yearly[year] || 0;
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 720 342");
  const left = 155, right = 54, top = 12, row = 37, plotW = 720 - left - right, max = 300;

  [0, 50, 100, 150, 200, 250, 300].forEach(t => {
    const x = left + t / max * plotW;
    svg.append(svgEl("line", { x1: x, y1: 4, x2: x, y2: top + row * 8 - 2, class: "gridline" }));
    svg.append(svgEl("text", { x, y: top + row * 8 + 17, "text-anchor": "middle", class: "axis" }, String(t)));
  });

  data.forEach(([name, val], i) => {
    const y = top + i * row;
    const barW = val / max * plotW;
    const pct = val / total * 100;
    svg.append(svgEl("text", { x: left - 11, y: y + 19, "text-anchor": "end", class: "axis" }, name));
    svg.append(svgEl("rect", { x: left, y: y + 4, width: plotW, height: 18, rx: 5, fill: "#F0F3F6" }));
    const bar = svgEl("rect", {
      x: left, y: y + 4, width: Math.max(3, barW), height: 18, rx: 5,
      fill: colors[i] || "#ccc", class: "point",
      "data-tip": name + ": " + money(val) + " · " + fmt(pct) + "% do total",
      tabindex: "0", role: "button",
      "aria-label": name + ", " + money(val) + ", " + fmt(pct) + " por cento"
    });
    svg.append(bar);
    svg.append(svgEl("text", { x: left + barW + 8, y: y + 18, class: "data-label" }, fmt(val)));
  });

  const legend = document.querySelector("#functionLegend");
  legend.innerHTML = "";
  data.forEach(([name, val], i) => {
    const pct = val / total * 100;
    const item = document.createElement("div");
    item.innerHTML = "<span class="legend-name"><i class="swatch" style="background:" + (colors[i] || "#ccc") + ""></i>" + name + "</span><span class="legend-value">" + money(val) + " · " + fmt(pct) + "%</span>";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "6px";
    item.style.fontSize = "12px";
    item.style.color = "#30445e";
    const swatch = item.querySelector(".swatch");
    swatch.style.display = "inline-block";
    swatch.style.width = "10px";
    swatch.style.height = "10px";
    swatch.style.borderRadius = "2px";
    legend.append(item);
  });

  document.querySelector("#functionSubtitle").textContent = "Oito maiores funções · " + year;
  document.querySelector("#functionFoot").textContent = "Total de " + money(total) + " em despesas empenhadas no exercício.";
}

function renderCompare() {
  const svg = document.querySelector("#compareChart");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 600 290");
  const L = 58, R = 24, T = 24, B = 47, W = 600 - L - R, H = 290 - T - B, max = 1100;

  [0, 250, 500, 750, 1000].forEach(v => {
    const y = T + H - (v / max * H);
    svg.append(svgEl("line", { x1: L, y1: y, x2: 600 - R, y2: y, class: "gridline" }));
    svg.append(svgEl("text", { x: L - 9, y: y + 4, "text-anchor": "end", class: "axis" }, v === 0 ? "0" : String(v)));
  });

  const xs = [190, 400];
  const vals = [yearly[2024] || 0, yearly[2025] || 0];
  const fills = ["#6B7B8C", "#7DF3FF"];
  const labels = ["2024", "2025"];

  vals.forEach((v, i) => {
    const h = v / max * H;
    const y = T + H - h;
    svg.append(svgEl("rect", { x: xs[i] - 49, y, width: 98, height: h, rx: 9, fill: fills[i] }));
    svg.append(svgEl("text", { x: xs[i], y: y - 10, "text-anchor": "middle", class: "data-label" }, fmt(v)));
    svg.append(svgEl("text", { x: xs[i], y: T + H + 24, "text-anchor": "middle", class: "axis" }, labels[i]));
  });

  const y1 = T + H - vals[0] / max * H;
  const y2 = T + H - vals[1] / max * H;
  svg.append(svgEl("line", { x1: xs[0] + 8, y1: y1 - 7, x2: xs[1] - 25, y2: y2 - 5, stroke: "#0A1F44", "stroke-width": 2, "stroke-dasharray": "5 5" }));
  const variacao = yearly[2024] ? ((yearly[2025] - yearly[2024]) / yearly[2024] * 100) : 0;
  svg.append(svgEl("text", { x: 300, y: 20, "text-anchor": "middle", fill: "#B87500", "font-size": 16, "font-weight": 700 }, variacao.toFixed(1).replace(".", ",") + "% nominal"));

  document.querySelector("#statTotal").textContent = money(yearly[2025] || 0);
  document.querySelector("#statVar").textContent = variacao.toFixed(1).replace(".", ",") + "%";
  document.querySelector("#statVarNote").textContent = "R$ " + fmt(yearly[2024] || 0) + " mi → R$ " + fmt(yearly[2025] || 0) + " mi";
  const acumulado = yearly[2020] ? ((yearly[2025] - yearly[2020]) / yearly[2020] * 100) : 0;
  document.querySelector("#statAcum").textContent = acumulado.toFixed(1).replace(".", ",") + "%";
  document.querySelector("#statAcum").nextElementSibling.textContent = "R$ " + fmt(yearly[2020] || 0) + " mi → R$ " + fmt(yearly[2025] || 0) + " mi";

  const top2025 = (funcs[2025] || [])[0];
  if (top2025) {
    const pctTop = top2025[1] / yearly[2025] * 100;
    document.querySelector("#statTop").textContent = top2025[0];
    document.querySelector("#statTopNote").textContent = money(top2025[1]) + " · " + fmt(pctTop) + "% do total";
  }
}

function renderLine() {
  const svg = document.querySelector("#lineChart");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 1100 295");
  const L = 62, R = 30, T = 28, B = 42, W = 1100 - L - R, H = 295 - T - B, max = 1100;
  const years = Object.keys(yearly).map(Number);

  [0, 200, 400, 600, 800, 1000].forEach(v => {
    const y = T + H - v / max * H;
    svg.append(svgEl("line", { x1: L, y1: y, x2: 1100 - R, y2: y, class: "gridline" }));
    svg.append(svgEl("text", { x: L - 10, y: y + 4, "text-anchor": "end", class: "axis" }, String(v)));
  });

  const pts = years.map((yr, i) => ({
    yr, val: yearly[yr] || 0,
    x: L + i * (W / (years.length - 1)),
    y: T + H - (yearly[yr] || 0) / max * H
  }));

  svg.append(svgEl("polyline", {
    points: pts.map(p => p.x + "," + p.y).join(" "),
    fill: "none", stroke: "#0A1F44", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round"
  }));

  pts.forEach(p => {
    svg.append(svgEl("circle", { cx: p.x, cy: p.y, r: 6, fill: "#7DF3FF", stroke: "#0A1F44", "stroke-width": 2, class: "point", "data-tip": p.yr + ": " + money(p.val) }));
    svg.append(svgEl("text", { x: p.x, y: p.y - 12, "text-anchor": "middle", class: "data-label" }, fmt(p.val)));
    svg.append(svgEl("text", { x: p.x, y: T + H + 23, "text-anchor": "middle", class: "axis" }, String(p.yr)));
  });

  years.forEach(yr => {
    const el = document.querySelector("#y" + yr);
    if (el) el.textContent = fmt(yearly[yr] || 0);
  });

  const acumulado = yearly[2020] ? ((yearly[2025] - yearly[2020]) / yearly[2020] * 100) : 0;
  document.querySelector("#trendStat").textContent = acumulado.toFixed(1).replace(".", ",") + "%";
}

document.querySelector("#yearSelect").addEventListener("change", function(e) { renderBars(Number(e.target.value)); });
renderBars(2025);
renderCompare();
renderLine();