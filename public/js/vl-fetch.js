// Manually implementing the parser
function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return headers.reduce((obj, header, i) => {
      obj[header] = isNaN(values[i]) ? values[i] : +values[i];
      return obj;
    }, {});
  });
}

// Fetching data
fetch("data.csv")
  .then((r) => r.text())
  .then((text) => {
    const data = parseCSV(text);

    // Vega-lite spec
    const spec2 = {
      data: { values: data },
      background: "#ffffff",
      width: "container",
      height: "container",
      autosize: { type: "fit", contains: "padding" },
      padding: { left: 2, right: 8, top: 6, bottom: 1.5 },
      mark: { type: "bar", cornerRadius: 3 },
      encoding: {
        x: {
          field: "category",
          type: "nominal",
          scale: { paddingInner: 0.1, paddingOuter: 0.02 },
        },
        y: { field: "value", type: "quantitative" },
      },
      config: {
        view: { stroke: "#e6e6e6" },
        axis: {
          grid: true,
          gridColor: "#eeeeee",
          domainColor: "#cccccc",
          tickColor: "#cccccc",
          labelColor: "#4b5563",
          titleColor: "#111827",
          labelFont: "Source Sans 3",
          titleFont: "Source Sans 3",
        },
      },
    };

    // Vega-embed to attach spec to the HTML div
    vegaEmbed("#vl-fetch", spec2, { renderer: "canvas", actions: false });
  })
  .catch((err) => console.error("Error loading CSV:", err));
