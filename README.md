# Atlas of Polymers

A free, history-narrated encyclopedia of the polymers that made the modern
world — 96 entries across seven eras (1833–2015), from nature's
macromolecules to designed smart materials. No ads, no logins, no tracking.

Each polymer page pairs an author-written historical narrative with a fully
structured, cited property dataset: identity, classification, history,
synthesis, structure & morphology, physical / thermal / mechanical
properties, chemical resistance, processing, applications, environmental &
recycling notes, and numbered references. Values that haven't been verified
yet say so honestly — nothing is faked.

**Browse**: a sortable, filterable catalogue (home) and an era-colored
timeline (`/timeline/`). Light/dark theme and three presentation styles
(Gilt · Vellum · Atelier) are switchable in the header.

## Development

Built with [Astro](https://astro.build) as a fully static site.

```
npm install
npm run dev     # http://localhost:4321/PolymerAtlas/
npm run build   # static build into dist/
```

Content lives in `src/content/` (MDX narratives + JSON property data,
validated by Zod schemas), controlled vocabularies in `src/data/taxonomy/`,
and every citation resolves into `references.bib`.

## License

Text and data: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
