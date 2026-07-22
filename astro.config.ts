import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import integrity from './src/integrations/integrity';
import rehypeAutolink from './src/lib/rehype-autolink';

// GitHub Pages project deploy — the site serves under this base path.
const base = '/PolymerAtlas';

export default defineConfig({
  site: 'https://kiarashfa.github.io',
  base,
  integrations: [integrity(), mdx(), react(), sitemap()],
  markdown: {
    // Astro 7 renders Markdown with its native Sätteri pipeline by default;
    // this site stays on the remark/rehype pipeline (unified()) because the
    // build-time autolinker and KaTeX are remark/rehype plugins.
    processor: unified({
      // Equations render at BUILD time (never client-side). Narrative prose
      // doesn't use $-math today (the author's text is never rewritten), but
      // any future concept derivation/worked-example MDX gets KaTeX for
      // free. Data-file equations render via katex.renderToString in
      // ConceptPage.
      remarkPlugins: [remarkMath],
      // Autolinking runs last, on the final HTML tree.
      rehypePlugins: [rehypeKatex, [rehypeAutolink, { base }]],
    }),
  },
});
