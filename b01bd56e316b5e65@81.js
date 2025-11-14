import define1 from "./a2e58f97fd5e8d7c@756.js";

function _d3(require){return(
require("d3@7")
)}

function _periods(){return(
[
  {
    id: 0,
    key: "Pre-Crisis (2019)",
    label: "2019 – Pre-Crisis",
    nodesFile: "nodes_Pre_Crisis_2019.csv",
    edgesFile: "edges_Pre_Crisis_2019.csv"
  },
  {
    id: 1,
    key: "Crisis (2020)",
    label: "2020 – Crisis",
    nodesFile: "nodes_Crisis_2020.csv",
    edgesFile: "edges_Crisis_2020.csv"
  },
  {
    id: 2,
    key: "Post-Crisis (2021)",
    label: "2021 – Post-Crisis",
    nodesFile: "nodes_Post_Crisis_2021.csv",
    edgesFile: "edges_Post_Crisis_2021.csv"
  },
  {
    id: 3,
    key: "Post-Crisis (2022)",
    label: "2022 – Post-Crisis",
    nodesFile: "nodes_Post_Crisis_2022.csv",
    edgesFile: "edges_Post_Crisis_2022.csv"
  },
  {
    id: 4,
    key: "Post-Crisis (2023)",
    label: "2023 – Post-Crisis",
    nodesFile: "nodes_Post_Crisis_2023.csv",
    edgesFile: "edges_Post_Crisis_2023.csv"
  },
  {
    id: 5,
    key: "Post-Crisis (2024)",
    label: "2024 – Post-Crisis",
    nodesFile: "nodes_Post_Crisis_2024.csv",
    edgesFile: "edges_Post_Crisis_2024.csv"
  }
]
)}

async function _dataByPeriod(FileAttachment)
{
  const map = new Map();

  // โหลดทีละไฟล์ (ต้องใช้ literal string เท่านั้น)
  const nodes2019 = await FileAttachment("nodes_Pre_Crisis_2019.csv").csv({typed: true});
  const edges2019 = await FileAttachment("edges_Pre_Crisis_2019.csv").csv({typed: true});

  const nodes2020 = await FileAttachment("nodes_Crisis_2020.csv").csv({typed: true});
  const edges2020 = await FileAttachment("edges_Crisis_2020.csv").csv({typed: true});

  const nodes2021 = await FileAttachment("nodes_Post_Crisis_2021.csv").csv({typed: true});
  const edges2021 = await FileAttachment("edges_Post_Crisis_2021.csv").csv({typed: true});

  const nodes2022 = await FileAttachment("nodes_Post_Crisis_2022.csv").csv({typed: true});
  const edges2022 = await FileAttachment("edges_Post_Crisis_2022.csv").csv({typed: true});

  const nodes2023 = await FileAttachment("nodes_Post_Crisis_2023.csv").csv({typed: true});
  const edges2023 = await FileAttachment("edges_Post_Crisis_2023.csv").csv({typed: true});

  const nodes2024 = await FileAttachment("nodes_Post_Crisis_2024.csv").csv({typed: true});
  const edges2024 = await FileAttachment("edges_Post_Crisis_2024.csv").csv({typed: true});

  // สร้างรายการ mapping ตาม periods
  const allData = [
    {id: 0, nodes: nodes2019, links: edges2019},
    {id: 1, nodes: nodes2020, links: edges2020},
    {id: 2, nodes: nodes2021, links: edges2021},
    {id: 3, nodes: nodes2022, links: edges2022},
    {id: 4, nodes: nodes2023, links: edges2023},
    {id: 5, nodes: nodes2024, links: edges2024}
  ];

  // แปลงค่า numeric
  for (const p of allData) {
    for (const n of p.nodes) {
      n.degree = +n.degree;
      n.strength = +n.strength;
      n.betweenness = +n.betweenness;
    }
    for (const e of p.links) {
      e.corr = +e.corr;
      e.abs_corr = +e.abs_corr;
      e.weight = +e.weight;
    }
    map.set(p.id, {nodes: p.nodes, links: p.links});
  }

  return map;
}


function _periodIndex(html,periods,d3)
{
  const width = 700;
  const height = 50;

  const form = html`<form style="width:${width}px; font:12px sans-serif;">
    <svg width="${width}" height="${height}"></svg>
    <input type="range" min="0" max="${periods.length - 1}" step="1" value="0"
           style="width:${width}px; margin-top:4px;">
    <div style="text-align:center; margin-top:4px;">
      <strong class="period-label"></strong>
    </div>
  </form>`;

  const svg = d3.select(form.querySelector("svg"));
  const slider = form.querySelector("input");
  const label = form.querySelector(".period-label");

  const x = d3.scalePoint()
      .domain(periods.map((d, i) => i))
      .range([40, width - 40]);

  const g = svg.append("g").attr("transform", `translate(0, ${height / 2})`);

  // เส้น timeline
  g.append("line")
    .attr("x1", x(0))
    .attr("x2", x(periods.length - 1))
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "#888");

  // tick + label
  const ticks = g.selectAll("g.tick")
    .data(periods)
    .join("g")
      .attr("class", "tick")
      .attr("transform", (d, i) => `translate(${x(i)},0)`);

  ticks.append("line")
    .attr("y1", -5)
    .attr("y2", 5)
    .attr("stroke", "#555");

  ticks.append("text")
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .text(d => d.key)
    .style("font-size", "10px")
    .style("fill", "#333");

  function setValue(v) {
    const i = +v;
    slider.value = i;
    label.textContent = periods[i].label;
    form.value = i;
    form.dispatchEvent(new CustomEvent("input"));
  }

  slider.addEventListener("input", () => setValue(slider.value));
  setValue(slider.value);

  return form;
}


function _corrThreshold(Inputs){return(
Inputs.range([0, 1], {
  step: 0.01,
  value: 0.0,
  label: "Correlation filter"
})
)}

function _corrColor(){return(
corr => {
  if (corr < 0) return "#d73027";          // Negative (แดง)
  if (corr <= 0.40) return "#F59D38";      // Weak (ส้ม)
  if (corr <= 0.60) return "#a6d96a";      // Moderate (เขียวอ่อน)
  return "#1a9850";                        // Strong (เขียวเข้ม)
}
)}

function _corrLegend(d3)
{
  const width = 260;
  const height = 100;
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

  const items = [
    {label: "Corr < 0 (Negative)", color: "#d73027"},
    {label: "0.00 - 0.40 (Weak)", color: "#F59D38"},
    {label: "0.41 - 0.60 (Moderate)", color: "#a6d96a"},
    {label: "0.61 - 1.00 (Strong)", color: "#1a9850"}
  ];

  const g = svg.append("g").attr("transform", "translate(10,10)");

  const row = g.selectAll("g.row")
    .data(items)
    .join("g")
      .attr("class", "row")
      .attr("transform", (d,i) => `translate(0, ${i * 14})`);

  row.append("line")
    .attr("x1", 0)
    .attr("x2", 30)
    .attr("y1", 6)
    .attr("y2", 6)
    .attr("stroke", d => d.color)
    .attr("stroke-width", 4)
    .attr("stroke-linecap", "round");

  row.append("text")
    .attr("x", 40)
    .attr("y", 9)
    .text(d => d.label)
    .attr("font-size", 10)
    .attr("fill", "#333");

  return svg.node();
}


function _drag(d3){return(
function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.2).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
)}

async function _nodeImages(FileAttachment)
{
  // อ่านไฟล์ mapping รูปภาพ
  const rows = await FileAttachment("node_pic.csv").csv();

  const map = new Map();
  for (const r of rows) {
    // เผื่อกรณีมี BOM ที่หน้าชื่อคอลัมน์
    const id = r.Id || r["﻿Id"] || r["\ufeffId"] || r.id;
    if (id && r.image) {
      map.set(id, r.image);
    }
  }
  return map;  // Map: id → image URL
}


function _chart(periods,periodIndex,dataByPeriod,corrThreshold,d3,corrColor,drag,nodeImages)
{
  const width = 1000;
  const height = 600;

  const period = periods[periodIndex];
  const {nodes, links} = dataByPeriod.get(period.id);

  // filter edges ตาม corrThreshold (ใช้ abs_corr)
  const minAbsCorr = corrThreshold;
  const filteredLinks = links.filter(d => d.abs_corr >= minAbsCorr);

  // เก็บเฉพาะ node ที่มี edge หลัง filter
  const usedIds = new Set();
  for (const e of filteredLinks) {
    usedIds.add(e.source);
    usedIds.add(e.target);
  }
  const filteredNodes = nodes.filter(n => usedIds.has(n.id));

  // สร้าง map id → node object (ใช้กับ forceLink)
  const nodeById = new Map(filteredNodes.map(d => [d.id, d]));

  const linksWithRef = filteredLinks.map(d => Object.assign({}, d, {
    source: nodeById.get(d.source),
    target: nodeById.get(d.target)
  }));

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // scale ขนาด node = strength
  const strengthExtent = d3.extent(filteredNodes, d => d.strength);
  const nodeSize = d3.scaleSqrt()
    .domain(strengthExtent)
    .range([4, 20]);

  // scale ความหนาเส้น = abs_corr
  const absExtent = d3.extent(filteredLinks, d => d.abs_corr);
  const linkWidth = d3.scaleLinear()
    .domain(absExtent)
    .range([0.3, 5]);

  // ลบ tooltip เก่า (ถ้ามี) ก่อนสร้างใหม่
  d3.selectAll(".corr-tooltip").remove();

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "corr-tooltip")
    .style("position", "fixed")
    .style("pointer-events", "none")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "3px")
    .style("padding", "4px 6px")
    .style("font", "10px sans-serif")
    .style("opacity", 0);

  function showTooltip(htmlContent, event) {
    tooltip.html(htmlContent)
      .style("left", (event.clientX + 10) + "px")
      .style("top", (event.clientY + 10) + "px")
      .style("opacity", 0.95);
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  // force simulation
  const simulation = d3.forceSimulation(filteredNodes)
   .force("link",
      d3.forceLink(linksWithRef)
       .id(d => d.id)
        .distance(d => 250 * (1 - d.abs_corr) + 80)   // เพิ่มระยะเส้น
        .strength(d => d.abs_corr * 0.5)              // ลดแรงดึงลง
    )
    .force("charge", d3.forceManyBody().strength(-200))  // ดัน node ออก
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => nodeSize(d.strength) + 15)); // กันชนใหญ่ขึ้น


  // draw links (ของเดิม ไม่ต้องแก้)
  const link = svg.append("g")
      .attr("stroke-opacity", 0.8)
    .selectAll("line")
    .data(linksWithRef)
    .join("line")
      .attr("stroke", d => corrColor(d.corr))
      .attr("stroke-width", d => linkWidth(d.abs_corr))
      .on("mousemove", (event, d) => {
        showTooltip(
          `<strong>${d.source.label} – ${d.target.label}</strong><br>
           corr: ${d.corr.toFixed(3)}<br>
           |corr|: ${d.abs_corr.toFixed(3)}`,
          event
        );
      })
      .on("mouseleave", hideTooltip);

  // ------- เพิ่ม defs สำหรับ clipPath ของรูป --------
  const defs = svg.append("defs");

  const clip = defs.selectAll("clipPath")
    .data(filteredNodes, d => d.id)
    .join("clipPath")
      .attr("id", d => `clip-${d.id}`);

  clip.selectAll("circle")
    .data(d => [d])
    .join("circle")
      .attr("r", d => nodeSize(d.strength))
      .attr("cx", 0)
      .attr("cy", 0);

  // ------- draw nodes เป็น group (circle + image อยู่ใน g เดียวกัน) --------
  const nodeG = svg.append("g")
    .selectAll("g")
    .data(filteredNodes)
    .join("g")
      .call(drag(simulation))
      .on("mousemove", (event, d) => {
        showTooltip(
          `<strong>${d.label}</strong><br>
           Group: ${d.group}<br>
           Region: ${d.region}<br>
           Degree: ${d.degree}<br>
           Strength: ${d.strength.toFixed(3)}<br>
           Betweenness: ${d.betweenness.toFixed(3)}`,
          event
        );
      })
      .on("mouseleave", hideTooltip);

  // วงกลมพื้นหลัง + กรอบ node (เหมือนเดิม)
  nodeG.append("circle")
      .attr("r", d => nodeSize(d.strength))
      .attr("fill", "#ffffff")
      .attr("stroke", "#546e7a")
      .attr("stroke-width", 1);

  // รูป logo อยู่ใน node (ใช้ clipPath ให้เป็นวงกลม)
  nodeG.append("image")
      .attr("href", d => nodeImages.get(d.id) || null)
      .attr("width", d => 2 * nodeSize(d.strength))
      .attr("height", d => 2 * nodeSize(d.strength))
      .attr("x", d => -nodeSize(d.strength))
      .attr("y", d => -nodeSize(d.strength))
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("clip-path", d => `url(#clip-${d.id})`);

  // labels (เหมือนเดิม)
  const label = svg.append("g")
      .attr("font-size", 10)
      .attr("font-weight", "400")
      .attr("pointer-events", "none")
   .selectAll("text")
   .data(filteredNodes)
   .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", d => -nodeSize(d.strength) - 2)
      .attr("stroke", "white")          // เส้นด้านหลัง
      .attr("stroke-width", 4)          // ปรับให้ใหญ่ขึ้น = พื้นหลังใหญ่ขึ้น
      .attr("stroke-opacity", 0.7)      // โปร่งใส
      .attr("paint-order", "stroke")    // วาด stroke ก่อน fill
      .attr("fill", "#000")             // ตัวหนังสือดำ
      .text(d => d.label);

  // ------- อัปเดตตำแหน่งตอน simulation วิ่ง --------
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeG
      .attr("transform", d => {
        // กันไม่ให้หลุดขอบ
        d.x = Math.max(40, Math.min(width - 40, d.x));
        d.y = Math.max(40, Math.min(height - 40, d.y));
        return `translate(${d.x},${d.y})`;
      });

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y - 2);
  });

  svg.append("text")
    .attr("x", 20)
    .attr("y", 24)
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .text(`Assets Correlation Network Analysis – ${period.key}`);

  return svg.node();
}


function _mainView(html,chart,$0,$1,corrLegend)
{
  const container = html`
    <div style="
      position: relative;
      width: 100%;
      max-width: 1100px;
      margin: auto;
      font: 12px sans-serif;
      padding: 20px 20px 80px 20px;
      box-sizing: border-box;
    ">
      <!-- พื้นที่กราฟหลัก -->
      <div id="graph" style="width:100%;"></div>

      <!-- time slider: กลางล่างสุด -->
      <div id="timeline"
           style="
             position: absolute;
             left: 50%;
             bottom: 10px;
             transform: translateX(-50%);
             width: 70%;
             text-align: center;
           ">
      </div>

      <!-- filter: มุมขวาบน -->
      <div id="filter"
           style="
             position: absolute;
             top: 10px;
             right: 20px;
           ">
      </div>

      <!-- legend: มุมขวาล่าง -->
      <div id="legend"
           style="
             position: absolute;
             bottom: 120px;
             right: -20px;
             background: white;
             padding: 5px 10px;
             border-radius: 5px;
           ">
      </div>
    </div>
  `;

  const graphDiv    = container.querySelector("#graph");
  const timelineDiv = container.querySelector("#timeline");
  const filterDiv   = container.querySelector("#filter");
  const legendDiv   = container.querySelector("#legend");

  // ใช้ของเดิมที่มีอยู่แล้ว
  graphDiv.append(chart);                 // กราฟ
  timelineDiv.append($0); // time slider
  filterDiv.append($1); // Correlation filter
  legendDiv.append(corrLegend);           // legend สี

  return container;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["nodes_Pre_Crisis_2019.csv", {url: new URL("./files/b336c1586c9aa92c8df3c01a805694e0e5cc5bf0bda44b843ece12e9c390a8ea7f10fc367854a9ac44d3b10e363eeac662cf15de9455682132358af8ecf9f9ae.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["edges_Pre_Crisis_2019.csv", {url: new URL("./files/e5157c97f8a5bed9975dcd692e428c682a81abca67542e9bb234f8028ef7b4752a1e0a6c1b6b4bf6bd67a022133b8a01f0ae8865055fd2834f2fbed9f54d514e.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["nodes_Post_Crisis_2024.csv", {url: new URL("./files/47d9e309ca0af0e3362e591d9e838dfbe86cfe08eb9988e304dffb5c2c6fdccc16b8499f6412a3e16026734271ce0e3fa10caac629cdddaceaee79b958da42d0.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["nodes_Post_Crisis_2022.csv", {url: new URL("./files/b801683dde26490d52e9e4c65dc4a6b94da8cc97b809670c4fc953107fe420cb156a795b002295b4a19f13bb9226fc54b3b24702037a3ea67e2411d14d028d8f.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["edges_Post_Crisis_2023.csv", {url: new URL("./files/4e77a295fde66c6b365f236755abf4f58298cf0daf66df0ecf9925ae70f71a9767385d96d79a0583802cd29f1152fabec18073b9c1288db7aba481aaa89ffc57.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["edges_Post_Crisis_2022.csv", {url: new URL("./files/f8050fff6ad8b8ccf6ed0d81e93f2184753f72a92d073c5aa6cd9e6b8796d4afbc1c9236897c87ccfdc511066c1cb742ae7b01b1d40de21ca4081e4402f8f3ab.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["nodes_Post_Crisis_2023.csv", {url: new URL("./files/46e64c6e49acae1dda115d3fd86a6b835d000854ac473be9f2509e564d5271aa3a66ca3cf2d7cd83b17d52a49d22ff98dd93c8063aea97aeec2166bf4ca818b6.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["nodes_Post_Crisis_2021.csv", {url: new URL("./files/4036fe01695f3a66b64c4c9e9e568b1a7396b91d127ad1cf0daee68b54d7691384259eafb29e7710a34899696ed91b39d365795727e1b5eac61019d1c2bfd49e.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["nodes_Crisis_2020.csv", {url: new URL("./files/839874f9ce8f899672ed7154ab2cb163ddbd63cdfa78d2e8e1642213743728cf9f525c43ed3e47cc84a0b602a9ff08cd3dab62497f0e2df98c0581a6081e3679.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["edges_Crisis_2020.csv", {url: new URL("./files/0800ba37528800b827438ef3ca8912ef50ec192e95962ab5fdc1de35dda10672f0f14d7a100adc3abfb11eee6d538379e9e6e66fba1181cda77f9f2d0ac9f475.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["edges_Post_Crisis_2021.csv", {url: new URL("./files/51705b2e7ca7a139938e2e35a7a1efdabd1c0e2453a3f0f8fbcbef8d79a516ddabede96484f678dd5f9cfc22dfdbbbb86424626c701467adb2294442704d0528.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["edges_Post_Crisis_2024.csv", {url: new URL("./files/20f3afcf4b7649aae911a6122c856dd3fcbb75792cb07bbb6b8532f4f761d3868ff12613aa8e3c96048a8dd48090d4ce646879bddaf7983aaa82e57afb227950.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["node_pic.csv", {url: new URL("./files/441d9327bb319792f32c8a05f32e2d8d28a133dd41a1cbe9c2f3939942c64100364fe0c4a607e6d0ed1719185e1f1dbd78598adc0f8b31adb268a2c40a6a8ad4.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  const child1 = runtime.module(define1);
  main.import("Inputs", child1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("periods")).define("periods", _periods);
  main.variable(observer("dataByPeriod")).define("dataByPeriod", ["FileAttachment"], _dataByPeriod);
  main.variable(observer("viewof periodIndex")).define("viewof periodIndex", ["html","periods","d3"], _periodIndex);
  main.variable(observer("periodIndex")).define("periodIndex", ["Generators", "viewof periodIndex"], (G, _) => G.input(_));
  main.variable(observer("viewof corrThreshold")).define("viewof corrThreshold", ["Inputs"], _corrThreshold);
  main.variable(observer("corrThreshold")).define("corrThreshold", ["Generators", "viewof corrThreshold"], (G, _) => G.input(_));
  main.variable(observer("corrColor")).define("corrColor", _corrColor);
  main.variable(observer("corrLegend")).define("corrLegend", ["d3"], _corrLegend);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("nodeImages")).define("nodeImages", ["FileAttachment"], _nodeImages);
  main.variable(observer("chart")).define("chart", ["periods","periodIndex","dataByPeriod","corrThreshold","d3","corrColor","drag","nodeImages"], _chart);
  main.variable(observer("mainView")).define("mainView", ["html","chart","viewof periodIndex","viewof corrThreshold","corrLegend"], _mainView);
  return main;
}
