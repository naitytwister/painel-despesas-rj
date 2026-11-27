// BEGIN GENERATED DATA — values in R$ millions
const yearly = {
  2020: 25210.871575,
  2021: 26896.773495,
  2022: 32683.127755,
  2023: 36950.848866,
  2024: 39634.080318,
  2025: 39127.713548
};

const funcs = {
  "2020": [["Previdência Social",5619.814771],["Saúde",4908.212818],["Educação",4841.029772],["Urbanismo",2497.868378],["Encargos Especiais",1904.386979],["Administração",1613.487221],["Legislativa",882.140477],["Assistência Social",810.76482]],
  "2021": [["Previdência Social",5705.184219],["Educação",5645.711287],["Saúde",5218.822715],["Encargos Especiais",2870.675357],["Urbanismo",2201.284769],["Administração",1455.882709],["Legislativa",870.763928],["Assistência Social",788.334284]],
  "2022": [["Saúde",6820.512146],["Previdência Social",5935.812931],["Educação",5867.021229],["Urbanismo",3498.565662],["Encargos Especiais",2816.906705],["Administração",1942.972964],["Transporte",1160.568243],["Legislativa",1000.229146]],
  "2023": [["Saúde",7018.961714],["Educação",6699.916937],["Previdência Social",6360.136271],["Urbanismo",4181.623597],["Encargos Especiais",2870.994496],["Transporte",2798.12894],["Administração",1815.107163],["Legislativa",1088.480568]],
  "2024": [["Saúde",7642.644288],["Educação",7151.238933],["Previdência Social",6789.834775],["Urbanismo",4635.356346],["Encargos Especiais",3242.408212],["Administração",2225.698112],["Transporte",2203.933444],["Saneamento",1097.208158]],
  "2025": [["Saúde",7754.089613],["Educação",7713.730032],["Previdência Social",6925.912786],["Urbanismo",3797.283642],["Encargos Especiais",3513.126556],["Administração",2330.140445],["Transporte",1932.602723],["Legislativa",1222.41339]]
};
// END GENERATED DATA

const colors = ["#7DF3FF", "#63D6C1", "#FFB84C", "#6B7B8C", "#315784", "#A8C7D8", "#9FC7C0", "#D0A65B"];
const years = Object.keys(yearly).map(Number).sort((a, b) => a - b);
const fmt = (x, d = 1) => Number(x).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const moneyMi = x => "R$ " + fmt(x) + " mi";
const moneyCompact = x => x >= 1000 ? "R$ " + fmt(x / 1000) + " bi" : moneyMi(x);
const pctFmt = x => (x > 0 ? "+" : "") + fmt(x) + "%";

function svgEl(tag, attrs = {}, text = "") {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== "") node.textContent = text;
  return node;
}

const tooltip = document.createElement("div");
tooltip.setAttribute("role", "status");
tooltip.style.cssText = "position:fixed;display:none;z-index:99;background:#0A1F44;color:#fff;border-radius:8px;padding:8px 10px;font:12px Inter,Arial,sans-serif;pointer-events:none;box-shadow:0 8px 26px rgba(10,31,68,.18)";
document.body.appendChild(tooltip);

function addTooltipEvents(svg) {
  svg.querySelectorAll("[data-tip]").forEach(el => {
    const show = event => {
      tooltip.textContent = el.getAttribute("data-tip");
      tooltip.style.display = "block";
      const x = event.clientX || 0;
      const y = event.clientY || 0;
      tooltip.style.left = Math.min(x + 12, window.innerWidth - 230) + "px";
      tooltip.style.top = Math.min(y + 12, window.innerHeight - 55) + "px";
    };
    el.addEventListener("pointerenter", show);
    el.addEventListener("pointermove", show);
    el.addEventListener("focus", show);
    el.addEventListener("pointerleave", () => { tooltip.style.display = "none"; });
    el.addEventListener("blur", () => { tooltip.style.display = "none"; });
  });
}

function setFootnote(name, value, total) {
  const share = total ? value / total * 100 : 0;
  document.querySelector("#functionFoot").textContent = name
    ? name + ": " + moneyMi(value) + " (" + fmt(share) + "% do total de " + moneyCompact(total) + ")."
    : "Total de " + moneyCompact(total) + " em despesas empenhadas, exceto intraorçamentárias, no exercício.";
}

function renderBars(year) {
  const svg = document.querySelector("#barChart");
  const data = (funcs[String(year)] || []).slice(0, 8);
  const total = yearly[year] || 0;
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 720 342");
  const left = 192, right = 64, top = 12, row = 37, plotW = 720 - left - right;
  const maxValue = data.reduce((acc, d) => Math.max(acc, d[1]), 0);
  const max = Math.max(8000, Math.ceil(maxValue / 2000) * 2000);

  [0, 1, 2, 3, 4].forEach(i => {
    const tick = max / 4 * i;
    const x = left + tick / max * plotW;
    svg.append(svgEl("line", { x1: x, y1: 4, x2: x, y2: top + row * 8 - 2, class: "gridline" }));
    svg.append(svgEl("text", { x, y: top + row * 8 + 17, "text-anchor": "middle", class: "axis" }, fmt(tick, 0)));
  });

  const legend = document.querySelector("#functionLegend");
  legend.innerHTML = "";
  data.forEach(([name, value], index) => {
    const y = top + index * row;
    const barWidth = Math.max(2, value / max * plotW);
    const share = total ? value / total * 100 : 0;
    svg.append(svgEl("text", { x: left - 11, y: y + 19, "text-anchor": "end", class: "axis" }, name));
    svg.append(svgEl("rect", { x: left, y: y + 4, width: plotW, height: 18, rx: 5, fill: "#F0F3F6" }));
    const bar = svgEl("rect", {
      x: left, y: y + 4, width: barWidth, height: 18, rx: 5,
      fill: colors[index % colors.length], class: "point",
      "data-tip": name + ": " + moneyMi(value) + " · " + fmt(share) + "% do total",
      tabindex: "0", role: "button", "aria-label": name + ", " + moneyMi(value) + ", " + fmt(share) + "% do total"
    });
    bar.addEventListener("click", () => setFootnote(name, value, total));
    bar.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") setFootnote(name, value, total); });
    svg.append(bar);
    svg.append(svgEl("text", { x: Math.min(left + barWidth + 8, 708), y: y + 18, class: "data-label" }, fmt(value)));

    const item = document.createElement("div");
    item.className = "legend-item";
    item.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:#30445e;min-width:220px;flex:1 1 220px";
    const label = document.createElement("span");
    label.style.cssText = "display:flex;align-items:center;gap:7px;min-width:0";
    const swatch = document.createElement("i");
    swatch.style.cssText = "display:inline-block;width:10px;height:10px;border-radius:3px;flex:0 0 10px";
    swatch.style.background = colors[index % colors.length];
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    label.append(swatch, nameSpan);
    const amount = document.createElement("strong");
    amount.textContent = moneyMi(value) + " · " + fmt(share) + "%";
    item.append(label, amount);
    item.addEventListener("click", () => setFootnote(name, value, total));
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", name + ", " + amount.textContent);
    item.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setFootnote(name, value, total); } });
    legend.append(item);
  });
  addTooltipEvents(svg);
  document.querySelector("#functionSubtitle").textContent = "Oito maiores funções observadas · " + year;
  setFootnote("", 0, total);
}

function renderCompare() {
  const svg = document.querySelector("#compareChart");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 600 290");
  const left = 64, right = 28, top = 26, bottom = 48, width = 600 - left - right, height = 290 - top - bottom, max = 45000;
  [0, 10000, 20000, 30000, 40000].forEach(tick => {
    const y = top + height - tick / max * height;
    svg.append(svgEl("line", { x1: left, y1: y, x2: 600 - right, y2: y, class: "gridline" }));
    svg.append(svgEl("text", { x: left - 9, y: y + 4, "text-anchor": "end", class: "axis" }, fmt(tick / 1000, 0)));
  });
  const xPositions = [190, 410];
  const values = [yearly[2024] || 0, yearly[2025] || 0];
  const fill = ["#6B7B8C", "#7DF3FF"];
  const labels = ["2024", "2025"];
  values.forEach((value, index) => {
    const heightValue = value / max * height;
    const y = top + height - heightValue;
    const bar = svgEl("rect", {
      x: xPositions[index] - 48, y, width: 96, height: heightValue, rx: 9, fill: fill[index],
      class: "point", "data-tip": labels[index] + ": " + moneyCompact(value), tabindex: "0"
    });
    svg.append(bar);
    svg.append(svgEl("text", { x: xPositions[index], y: y - 9, "text-anchor": "middle", class: "data-label" }, fmt(value / 1000) + " bi"));
    svg.append(svgEl("text", { x: xPositions[index], y: top + height + 25, "text-anchor": "middle", class: "axis" }, labels[index]));
  });
  const y2024 = top + height - values[0] / max * height;
  const y2025 = top + height - values[1] / max * height;
  svg.append(svgEl("line", { x1: xPositions[0] + 8, y1: y2024 - 8, x2: xPositions[1] - 24, y2: y2025 - 8, stroke: "#0A1F44", "stroke-width": 2, "stroke-dasharray": "5 5" }));
  const variation = values[0] ? (values[1] - values[0]) / values[0] * 100 : 0;
  document.querySelector("#compareCalloutHeadline").textContent = pctFmt(variation) + " nominal.";
  svg.append(svgEl("text", { x: 300, y: 19, "text-anchor": "middle", fill: "#B87500", "font-size": 16, "font-weight": 700 }, pctFmt(variation) + " nominal"));
  addTooltipEvents(svg);
  document.querySelector("#statTotal").textContent = moneyCompact(yearly[2025] || 0);
  document.querySelector("#statVar").textContent = pctFmt(variation);
  document.querySelector("#statVarNote").textContent = moneyCompact(yearly[2024] || 0) + " → " + moneyCompact(yearly[2025] || 0);
  const accumulated = yearly[2020] ? (yearly[2025] / yearly[2020] - 1) * 100 : 0;
  document.querySelector("#statAcum").textContent = pctFmt(accumulated);
  document.querySelector("#statAcum").parentElement.querySelector(".note").textContent = moneyCompact(yearly[2020] || 0) + " → " + moneyCompact(yearly[2025] || 0);
  const topFunction = (funcs["2025"] || [])[0];
  if (topFunction) {
    document.querySelector("#statTop").textContent = topFunction[0];
    document.querySelector("#statTopNote").textContent = moneyMi(topFunction[1]) + " · " + fmt(topFunction[1] / yearly[2025] * 100) + "% do total exceto intra";
  }
}

function renderLine() {
  const svg = document.querySelector("#lineChart");
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 1100 295");
  const left = 70, right = 35, top = 28, bottom = 42, width = 1100 - left - right, height = 295 - top - bottom, max = 45000;
  [0, 10000, 20000, 30000, 40000].forEach(tick => {
    const y = top + height - tick / max * height;
    svg.append(svgEl("line", { x1: left, y1: y, x2: 1100 - right, y2: y, class: "gridline" }));
    svg.append(svgEl("text", { x: left - 10, y: y + 4, "text-anchor": "end", class: "axis" }, fmt(tick / 1000, 0)));
  });
  const points = years.map((year, index) => ({
    year, value: yearly[year] || 0,
    x: left + index * width / (years.length - 1),
    y: top + height - (yearly[year] || 0) / max * height
  }));
  svg.append(svgEl("polyline", {
    points: points.map(point => point.x + "," + point.y).join(" "),
    fill: "none", stroke: "#0A1F44", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round"
  }));
  points.forEach((point, index) => {
    svg.append(svgEl("circle", {
      cx: point.x, cy: point.y, r: 6, fill: "#7DF3FF", stroke: "#0A1F44", "stroke-width": 2,
      class: "point", "data-tip": point.year + ": " + moneyCompact(point.value), tabindex: "0"
    }));
    const first = index === 0, last = index === points.length - 1;
    const lx = first ? point.x + 13 : last ? point.x - 13 : point.x;
    const anchor = first ? "start" : last ? "end" : "middle";
    svg.append(svgEl("text", { x: lx, y: point.y - 12, "text-anchor": anchor, class: "data-label" }, fmt(point.value / 1000) + " bi"));
    svg.append(svgEl("text", { x: point.x, y: top + height + 23, "text-anchor": "middle", class: "axis" }, String(point.year)));
    const valueNode = document.querySelector("#y" + point.year);
    if (valueNode) valueNode.textContent = fmt(point.value / 1000);
  });
  addTooltipEvents(svg);
  const accumulated = yearly[2020] ? (yearly[2025] / yearly[2020] - 1) * 100 : 0;
  document.querySelector("#trendStat").textContent = pctFmt(accumulated);
}

const selector = document.querySelector("#yearSelect");
selector.addEventListener("change", event => renderBars(Number(event.target.value)));
renderBars(2025);
renderCompare();
renderLine();
