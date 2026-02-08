const svg = d3.select("#d3-basic");
const data = [30, 80, 45, 60, 20, 90, 50];

const renderBasic = () => {
  const { width, height } = svg.node().getBoundingClientRect();
  svg.attr("width", width).attr("height", height);
  svg.selectAll("*").remove();

  const margin = { top: 10, right: 10, bottom: 24, left: 30 };
  const innerWidth = Math.max(1, width - margin.left - margin.right);
  const innerHeight = Math.max(1, height - margin.top - margin.bottom);

  const xScale = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([innerHeight, 0]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(d))
    .attr("fill", "steelblue");

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat((i) => String.fromCharCode(65 + i)));
};

renderBasic();
window.addEventListener("resize", renderBasic);
