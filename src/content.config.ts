import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import erasData from './data/taxonomy/eras.json';
import { polymerDataSchema } from './content/polymer-data-schema';
import { conceptDataSchema } from './content/concept-data-schema';

// Content Layer API (Astro 6+): explicit glob loaders replace the legacy
// `type: 'content' | 'data'` collections. Files stay where they always
// were under src/content/; entries are joined by the REAL frontmatter/JSON
// `data.id` field everywhere (never the loader-derived entry.id).

// Narrative files carry the author's text + minimal frontmatter only.
// The full property schema (thermal/mechanical/chemical/etc.) lives in a
// separate data collection — two files per entry, never merged, so the
// data side can be re-researched without ever touching the author's text.
const eraNames = erasData.map((e) => e.name) as [string, ...string[]];

const narrativeSchema = z.object({
  id: z.string(),
  name: z.string(),
  abbreviation: z.array(z.string()).default([]),
  page_type: z.enum(['polymer_hub', 'polymer_variant', 'concept']),
  parent: z.string().nullable().default(null),
  year_of_origin: z.number(),
  era: z.enum(eraNames),
  tagline: z.string().nullable().default(null),
  key_figures: z.array(z.string()).default([]),
  // Always auditable: which narratives are hand-written vs. AI-authored.
  narrative_author: z.enum(['owner-authored', 'claude-authored']),
});

const polymers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/polymers' }),
  schema: narrativeSchema,
});
const concepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/concepts' }),
  schema: narrativeSchema,
});

// Structured data files, keyed by the same id as the narrative collection
// above. polymerData follows the full 13-block polymer schema; conceptData
// is a lighter schema (equations/summary/history) for theory pages.
const polymerData = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/polymerData' }),
  schema: polymerDataSchema,
});
const conceptData = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/conceptData' }),
  schema: conceptDataSchema,
});

export const collections = { polymers, concepts, polymerData, conceptData };
