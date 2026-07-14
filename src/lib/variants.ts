// The three Edition presentation styles — a client-side USER PREFERENCE
// switched from the header, like light/dark (owner decision, 2026-07-14).
// Each swaps only the token overlay (`.variant-<id>` on <html>, incl. its
// own font family) defined in Layout.astro; Gilt is the default.
export interface EditionVariant {
  id: 'gilt' | 'vellum' | 'atelier';
  name: string;
  note: string;
}

export const VARIANTS: EditionVariant[] = [
  {
    id: 'gilt',
    name: 'Gilt',
    note: 'Ivory paper, gold-foil detailing, justified book text with drop caps — the fine-press private edition.',
  },
  {
    id: 'vellum',
    name: 'Vellum',
    note: 'Warmer parchment set in Garamond — no gold, each era’s own color is the only accent, left-set hero, ragged-right text.',
  },
  {
    id: 'atelier',
    name: 'Atelier',
    note: 'Cool gallery paper set in Constantia, modern uppercase labels, era-color number medallions, softer shadows — the luxury art-book catalogue.',
  },
];
