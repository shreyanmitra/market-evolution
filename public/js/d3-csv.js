// d3.csv automatically fetches and parses CSV data
d3.csv("data.csv", (d) => ({
  category: d.category,
  value: +d.value,
})).then((data) => {
  const svg = d3.select("#d3-csv");

  const renderCsv = () => {
    const { width, height } = svg.node().getBoundingClientRect();
    svg.attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 10, bottom: 24, left: 30 };
    const innerWidth = Math.max(1, width - margin.left - margin.right);
    const innerHeight = Math.max(1, height - margin.top - margin.bottom);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.category))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", "seagreen");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
  };

  renderCsv();
  window.addEventListener("resize", renderCsv);
});
