# Market Evolution

Interactive **D3.js treemap** of the largest U.S. public companies by **market capitalization (1989–2024)**. Rectangle area reflects relative market cap; color encodes **GICS-style sector**. The visualization was built for **CSE 442** (Data Visualization) at the University of Washington.

**Live site:** [https://shreyanmitra.github.io/market-evolution/](https://shreyanmitra.github.io/market-evolution/)

## Features

- **Year exploration** — scrub the timeline or use **Play / Pause** to animate through years.
- **Sector legend** — quick read of industry mix for the selected year.
- **Tooltips** — hover a company tile for name, ticker, rank, market cap, and sector.
- **Company drill-down** — click a tile to open a **market-cap-over-time** sparkline; click points to jump to that year.
- **Search** — filter by company name, display name, or ticker (matching tiles are highlighted).
- **Year notes** — contextual annotations in the sidebar for selected years.
- **Writeup** — design and methodology: [`public/writeup.html`](public/writeup.html) (also linked from the main page).

## Tech stack

- Vanilla HTML, CSS, and JavaScript (no build step)
- [D3 v7](https://d3js.org/) (loaded from CDN)
- Data: [`public/data.csv`](public/data.csv) (`Year`, `Rank`, `Company`, `Ticker`, `MarketCap_BillionsUSD`, `sector`, `displayName`, …)

## Repository layout

| Path | Purpose |
|------|---------|
| `public/index.html` | Main treemap application |
| `public/data.csv` | Company–year records |
| `public/writeup.html` | Project writeup |
| `.github/workflows/publish.yaml` | Deploy `public/` to GitHub Pages |

## Local preview

The app loads `data.csv` over HTTP. Serve the `public` folder (do not rely on `file://`):

```bash
npx --yes serve public
```

Then open the URL shown in the terminal (for example `http://localhost:3000`).

Alternatives: VS Code **Live Server**, or `python -m http.server` run from inside `public`.

## Deployment

Pushes to `main` trigger [GitHub Actions](.github/workflows/publish.yaml), which uploads the **`public`** directory as a Pages artifact. Ensure GitHub Pages is configured to use **GitHub Actions** as the source for this repository.

## Data sources

Attribution links also appear in the site footer:

- [Kaggle — S&P 500 top companies by market cap (from 1989)](https://www.kaggle.com/datasets/juanmerinobermejo/s-and-p-500-top-20-companies-by-market-cap-from-1989/data)
- [S&P 500 constituents reference (GitHub)](https://github.com/datasets/s-and-p-500-companies/blob/main/data/constituents.csv)

## Credits

**Authors:** Shreyan, Biniyam, and Kalkidan (CSE 442).

**Process & design notes:** [Observable notebook](https://observablehq.com/d/3cb48db7d2660444).

**AI use:** AI assistance was used for proofreading D3 syntax and converting Observable-style JavaScript to vanilla JS in `index.html`; outputs were reviewed by the authors.

---

*If this repository is forked, update the live site URL above to match your own GitHub Pages domain.*
