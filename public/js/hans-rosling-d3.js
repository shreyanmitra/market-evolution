const hansRoslingContainer = d3.select("#hans-rosling");
const hansRoslingSlider = d3.select("#hans-rosling-year");
const hansRoslingYearLabel = d3.select("#hans-rosling-year-label");
const hansRoslingExplodeButton = d3.select("#hans-rosling-explode");
const hansRoslingResetButton = d3.select("#hans-rosling-reset");
const hansRoslingCard = d3.select("#hans-rosling-card");
const hansRoslingBody = d3.select("body");

const hansRoslingSvg = hansRoslingContainer.append("svg");

const hansRoslingMargin = { top: 20, right: 20, bottom: 20, left: 60 };
let hansRoslingWidth = 0;
let hansRoslingHeight = 0;

const hansRoslingUrl = "/gapminder.csv";

const formatPopulation = d3.format("~s");

let hansRoslingData = [];
let hansRoslingYears = [];
let hansRoslingYear = null;
let hansRoslingScales = null;
let hansRoslingAxes = null;
let hansRoslingLayer = null;
let hansRoslingLabel = null;
let hansRoslingColor = null;
let hansRoslingExploded = false;
let hansRoslingFloatLayer = null;
let hansRoslingFloatTimer = null;
let hansRoslingBlastTimer = null;
let hansRoslingDimTimer = null;

const setupChart = () => {
  const bounds = hansRoslingContainer.node().getBoundingClientRect();
  hansRoslingWidth = Math.max(1, bounds.width);
  hansRoslingHeight = Math.max(1, bounds.height);

  hansRoslingSvg
    .attr("width", hansRoslingWidth)
    .attr("height", hansRoslingHeight);

  const innerWidth = Math.max(
    1,
    hansRoslingWidth - hansRoslingMargin.left - hansRoslingMargin.right,
  );
  const innerHeight = Math.max(
    1,
    hansRoslingHeight - hansRoslingMargin.top - hansRoslingMargin.bottom,
  );

  const x = d3
    .scaleLinear()
    .domain(d3.extent(hansRoslingData, (d) => d.fertility))
    .range([0, innerWidth])
    .nice();

  const y = d3
    .scaleLinear()
    .domain(d3.extent(hansRoslingData, (d) => d.lifeExpect))
    .range([innerHeight, 0])
    .nice();

  const size = d3
    .scaleSqrt()
    .domain(d3.extent(hansRoslingData, (d) => d.pop))
    .range([2, 36]);

  hansRoslingColor = d3
    .scaleOrdinal()
    .domain([...new Set(hansRoslingData.map((d) => d.cluster))])
    .range(d3.schemeTableau10);

  hansRoslingSvg.selectAll("*").remove();

  const g = hansRoslingSvg
    .append("g")
    .attr(
      "transform",
      `translate(${hansRoslingMargin.left},${hansRoslingMargin.top})`,
    );

  hansRoslingLayer = g.append("g").attr("class", "bubbles");

  const xAxis = d3.axisBottom(x).ticks(6);
  const yAxis = d3.axisLeft(y);

  const xAxisGroup = g
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis);

  const yAxisGroup = g.append("g").attr("class", "y-axis").call(yAxis);

  xAxisGroup
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("x", innerWidth)
    .attr("y", -10)
    .text("Fertility");

  yAxisGroup
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(20, ${hansRoslingMargin.top}) rotate(-90)`)
    .attr("text-anchor", "end")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("Life Expectancy");

  hansRoslingLabel = g
    .append("text")
    .attr("class", "year")
    .attr("x", 40)
    .attr("y", innerHeight - 20)
    .attr("fill", "#ccc")
    .attr("font-family", "Helvetica Neue, Arial")
    .attr("font-weight", 500)
    .attr("font-size", 80);

  hansRoslingScales = { x, y, size, innerWidth, innerHeight };
  hansRoslingAxes = { xAxis, yAxis, xAxisGroup, yAxisGroup };
};

const updateChart = (year) => {
  if (!hansRoslingScales) return;

  const { x, y, size } = hansRoslingScales;
  const filtered = hansRoslingData.filter((d) => d.year === year);

  hansRoslingLabel.text(year);

  const circles = hansRoslingLayer
    .selectAll("circle")
    .data(filtered, (d) => d.country);

  const circlesEnter = circles
    .enter()
    .append("circle")
    .attr("class", "country")
    .attr("cx", (d) => x(d.fertility))
    .attr("cy", (d) => y(d.lifeExpect))
    .attr("r", 0)
    .attr("fill", (d) => hansRoslingColor(d.cluster))
    .attr("opacity", 0);

  circlesEnter
    .append("title")
    .text(
      (d) =>
        `${d.country}\nPop: ${formatPopulation(d.pop)}\nFertility: ${d.fertility}\nLife expectancy: ${d.lifeExpect}`,
    );

  circles
    .merge(circlesEnter)
    .sort((a, b) => b.pop - a.pop)
    .transition()
    .duration(900)
    .attr("opacity", 0.75)
    .attr("cx", (d) => x(d.fertility))
    .attr("cy", (d) => y(d.lifeExpect))
    .attr("r", (d) => size(d.pop));

  circles
    .merge(circlesEnter)
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", null);
    });

  circles
    .exit()
    .transition()
    .duration(700)
    .attr("r", 0)
    .attr("opacity", 0)
    .remove();
};

const setExplosionState = (isExploded) => {
  hansRoslingExploded = isExploded;
  if (!hansRoslingExplodeButton.empty()) {
    hansRoslingExplodeButton.attr("disabled", isExploded ? true : null);
  }
  if (!hansRoslingResetButton.empty()) {
    hansRoslingResetButton.attr("disabled", isExploded ? null : true);
  }
  if (!hansRoslingSlider.empty()) {
    hansRoslingSlider.attr("disabled", isExploded ? true : null);
  }
};

const floatBubbles = () => {
  if (!hansRoslingScales || !hansRoslingLayer) return;

  if (!hansRoslingCard.empty()) {
    hansRoslingCard.classed("is-blasting", false);
    requestAnimationFrame(() => {
      hansRoslingCard.classed("is-blasting", true);
    });
    if (hansRoslingBlastTimer) {
      clearTimeout(hansRoslingBlastTimer);
    }
    hansRoslingBlastTimer = setTimeout(() => {
      hansRoslingCard.classed("is-blasting", false);
    }, 700);
  }

  if (!hansRoslingBody.empty()) {
    hansRoslingBody.classed("boom-dim", false);
    requestAnimationFrame(() => {
      hansRoslingBody.classed("boom-dim", true);
    });
    if (hansRoslingDimTimer) {
      clearTimeout(hansRoslingDimTimer);
    }
    hansRoslingDimTimer = setTimeout(() => {
      hansRoslingBody.classed("boom-dim", false);
    }, 700);
  }

  const doc = document.documentElement;
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const screenWidth = Math.max(1, doc.scrollWidth, doc.clientWidth);
  const screenHeight = Math.max(1, doc.scrollHeight, doc.clientHeight);

  setExplosionState(true);

  const nodes = [];

  hansRoslingLayer.selectAll("circle").each(function (d) {
    const rect = this.getBoundingClientRect();
    nodes.push({
      ...d,
      x: rect.left + scrollX + rect.width / 2,
      y: rect.top + scrollY + rect.height / 2,
      r: Math.max(1, rect.width / 2),
      baseVx: (Math.random() - 0.5) * 0.9,
      baseVy: (Math.random() - 0.5) * 0.9,
      burstVx: (Math.random() - 0.5) * 8,
      burstVy: (Math.random() - 0.5) * 8,
      vx: 0,
      vy: 0,
    });
  });

  if (!nodes.length) return;

  hansRoslingLayer.selectAll("circle").interrupt().attr("opacity", 0);

  if (!hansRoslingFloatLayer) {
    hansRoslingFloatLayer = d3
      .select("body")
      .append("svg")
      .attr("class", "hans-rosling-float-layer")
      .attr("width", screenWidth)
      .attr("height", screenHeight);
  } else {
    hansRoslingFloatLayer
      .attr("width", screenWidth)
      .attr("height", screenHeight)
      .selectAll("*")
      .remove();
  }

  hansRoslingFloatLayer
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => hansRoslingColor(d.cluster))
    .attr("opacity", 0.75);

  if (hansRoslingFloatTimer) {
    hansRoslingFloatTimer.stop();
  }

  const burstDuration = 800;
  hansRoslingFloatTimer = d3.timer((elapsed) => {
    const t = Math.min(1, elapsed / burstDuration);
    const mix = d3.easeCubicOut(t);
    nodes.forEach((node) => {
      node.vx = node.burstVx * (1 - mix) + node.baseVx * mix;
      node.vy = node.burstVy * (1 - mix) + node.baseVy * mix;
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -20) {
        node.x = screenWidth + 20;
      } else if (node.x > screenWidth + 20) {
        node.x = -20;
      }

      if (node.y < -20) {
        node.y = screenHeight + 20;
      } else if (node.y > screenHeight + 20) {
        node.y = -20;
      }
    });

    hansRoslingFloatLayer
      .selectAll("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  });
};

const resetBubbles = () => {
  if (!hansRoslingFloatLayer) {
    setExplosionState(false);
    updateChart(hansRoslingYear);
    return;
  }

  if (!hansRoslingCard.empty()) {
    hansRoslingCard.classed("is-blasting", false);
  }

  if (hansRoslingFloatTimer) {
    hansRoslingFloatTimer.stop();
    hansRoslingFloatTimer = null;
  }

  const containerRect = hansRoslingContainer.node().getBoundingClientRect();
  const { x, y, size } = hansRoslingScales;
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const offsetX = containerRect.left + scrollX + hansRoslingMargin.left;
  const offsetY = containerRect.top + scrollY + hansRoslingMargin.top;

  const targetByCountry = new Map(
    hansRoslingData
      .filter((d) => d.year === hansRoslingYear)
      .map((d) => [
        d.country,
        {
          x: offsetX + x(d.fertility),
          y: offsetY + y(d.lifeExpect),
          r: size(d.pop),
        },
      ]),
  );

  if (!hansRoslingExplodeButton.empty()) {
    hansRoslingExplodeButton.attr("disabled", true);
  }
  if (!hansRoslingResetButton.empty()) {
    hansRoslingResetButton.attr("disabled", true);
  }
  if (!hansRoslingSlider.empty()) {
    hansRoslingSlider.attr("disabled", true);
  }

  const returnTransition = hansRoslingFloatLayer
    .selectAll("circle")
    .transition()
    .duration(800)
    .ease(d3.easeCubicInOut)
    .attr("cx", (d) => (targetByCountry.get(d.country) || d).x)
    .attr("cy", (d) => (targetByCountry.get(d.country) || d).y)
    .attr("r", (d) => (targetByCountry.get(d.country) || d).r);

  returnTransition.end().then(() => {
    if (hansRoslingFloatLayer) {
      hansRoslingFloatLayer.remove();
      hansRoslingFloatLayer = null;
    }
    hansRoslingLayer.selectAll("circle").interrupt().attr("opacity", 0.75);
    setExplosionState(false);
  });
};

const handleResize = () => {
  if (!hansRoslingData.length) return;
  setupChart();
  updateChart(hansRoslingYear);
};

const init = async () => {
  const raw = await d3.csv(hansRoslingUrl);
  hansRoslingData = raw
    .map((d) => ({
      country: d.country,
      year: Number(d.year),
      lifeExpect: Number(d.life_expect),
      fertility: Number(d.fertility),
      pop: Number(d.pop),
      cluster: Number(d.cluster),
    }))
    .filter((d) => Number.isFinite(d.year));

  hansRoslingYears = [...new Set(hansRoslingData.map((d) => d.year))].sort(
    (a, b) => a - b,
  );

  hansRoslingYear = hansRoslingYears[0];

  hansRoslingSlider
    .attr("min", hansRoslingYears[0])
    .attr("max", hansRoslingYears[hansRoslingYears.length - 1])
    .attr("step", 5)
    .attr("value", hansRoslingYear);

  const updateSliderFill = (value) => {
    const min = Number(hansRoslingSlider.attr("min")) || 0;
    const max = Number(hansRoslingSlider.attr("max")) || 1;
    const clamped = Math.min(max, Math.max(min, value));
    const percent = ((clamped - min) / (max - min)) * 100;
    hansRoslingSlider.node().style.setProperty("--fill-percent", `${percent}%`);
  };

  hansRoslingYearLabel.text(hansRoslingYear);
  updateSliderFill(hansRoslingYear);

  setupChart();
  updateChart(hansRoslingYear);

  hansRoslingSlider.on("input", (event) => {
    const nextYear = Number(event.target.value);
    hansRoslingYearLabel.text(nextYear);
    hansRoslingYear = nextYear;
    updateSliderFill(nextYear);
    updateChart(hansRoslingYear);
  });

  if (!hansRoslingExplodeButton.empty()) {
    hansRoslingExplodeButton.on("click", floatBubbles);
  }

  if (!hansRoslingResetButton.empty()) {
    hansRoslingResetButton.on("click", resetBubbles);
  }

  setExplosionState(false);
};

init();
window.addEventListener("resize", handleResize);
