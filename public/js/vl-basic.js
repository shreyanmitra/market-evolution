// Define Vega-Lite spec
const spec1 = {
  data: {
    values: [
      { a: "A", b: 28 },
      { a: "B", b: 55 },
      { a: "C", b: 43 },
    ],
  },
  background: "#ffffff",
  width: "container",
  height: "container",
  autosize: { type: "fit", contains: "padding" },
  padding: { left: 2, right: 8, top: 6, bottom: 1.5 },
  mark: { type: "bar", cornerRadius: 3 },
  encoding: {
    x: {
      field: "a",
      type: "nominal",
      scale: { paddingInner: 0.1, paddingOuter: 0.02 },
    },
    y: { field: "b", type: "quantitative" },
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

// Embed visualization in #vis div
vegaEmbed("#vl-basic", spec1, { renderer: "canvas", actions: false });
