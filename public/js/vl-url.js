// Vega-Lite can read CSV directly if you give it a URL.
const spec3 = {
  data: { url: "data.csv" },
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
vegaEmbed("#vl-url", spec3, { renderer: "canvas", actions: false });
