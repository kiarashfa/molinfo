import { z } from 'astro/zod';
import erasData from '../data/taxonomy/eras.json';
import {
  propertyValueSchema,
  ratedValueSchema,
  imageObjectSchema,
  structureImageSchema,
  aliasSchema,
  monomerRefSchema,
  applicationSchema,
  chemicalFamilyEnum,
  backboneClassEnum,
  polymerizationMechanismEnum,
} from './schema-shared';

const eraNames = erasData.map((e) => e.name) as [string, ...string[]];

// Full polymer data schema, all 13 blocks. Lives in a separate data
// collection from the narrative MDX (two files per entry, never merged),
// joined by `id`. Concepts get their own lighter data schema -- this one
// is polymer_hub / polymer_variant only.
export const polymerDataSchema = z.object({
  // 1. Identity
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  abbreviation: z.array(z.string()).default([]),
  type: z.enum(['hub', 'variant']),
  parent: z.string().nullable().default(null),
  cas_number: z.string().nullable(),
  resin_id_code: z.string().nullable(),
  repeat_unit: z.string().nullable(), // BigSMILES
  notation_note: z.string().optional(), // required in spirit when repeat_unit is null
  iupac_name: z.string().nullable(),
  synonyms: z.array(z.string()).default([]),
  aliases: z.array(aliasSchema).default([]),

  // 2. Classification
  chemical_family: z.array(z.enum(chemicalFamilyEnum)).default([]),
  backbone_class: z.enum(backboneClassEnum).nullable(),
  polymerization_mechanism: z.array(z.enum(polymerizationMechanismEnum)).default([]),
  monomer: z.array(monomerRefSchema).default([]),
  polymer_class: z.enum(['thermoplastic', 'thermoset', 'elastomer']).nullable(),

  // 3. History hook (history_narrative itself lives in the paired MDX file)
  year_of_origin: z.number(),
  era: z.enum(eraNames),
  key_figures: z.array(z.string()).default([]),
  historical_events_referenced: z.array(z.string()).default([]),
  historical_images: z.array(imageObjectSchema).default([]),

  // 4. Synthesis
  synthesis: z.object({
    polymerization_type: z.string().nullable(),
    common_monomers: z.array(z.string()).default([]),
    catalysts: z.array(z.string()).default([]),
    industrial_process_notes: z.string().nullable(),
    synthesis_scheme_image: imageObjectSchema.nullable().default(null),
  }),

  // 5. Structure & morphology
  structure_morphology: z.object({
    tacticity: z.string().nullable(),
    crystallinity_typical: propertyValueSchema.nullable(),
    crystal_structure: z.string().nullable(),
    chain_flexibility_notes: z.string().nullable(),
    tg_relation_notes: z.string().nullable(),
  }),

  // 5b. Physical properties — density plus a few bulk properties that fit
  // none of the other blocks (several are fine to leave placeholder).
  physical: z.object({
    density: propertyValueSchema,
    melt_flow_index: propertyValueSchema,
    refractive_index: propertyValueSchema,
    dielectric_constant: propertyValueSchema,
    // Conducting polymers (polyaniline, polythiophene) have no other home
    // for their defining property. Use `conditions` for doping state, since
    // conductivity swings by orders of magnitude between doped/undoped forms.
    electrical_conductivity: propertyValueSchema,
  }),

  // 6. Thermal properties
  thermal: z.object({
    tg: propertyValueSchema,
    tm: propertyValueSchema,
    tc: propertyValueSchema,
    hdt: propertyValueSchema,
    decomposition_onset: propertyValueSchema,
    thermal_conductivity: propertyValueSchema,
  }),

  // 7. Mechanical properties
  mechanical: z.object({
    tensile_modulus: propertyValueSchema,
    yield_strength: propertyValueSchema,
    // Deliberately distinct from yield_strength -- many sources (esp.
    // Wikipedia infoboxes) report unqualified "tensile strength," which for
    // brittle/amorphous thermoplastics and elastomers (no distinct yield
    // region before failure) means strength at break, not a true yield
    // point. Conflating the two is a real mislabeling hazard.
    tensile_strength_at_break: propertyValueSchema,
    elongation_at_break: propertyValueSchema,
    impact_izod: propertyValueSchema,
    impact_charpy: propertyValueSchema,
    hardness: propertyValueSchema,
    flexural_modulus: propertyValueSchema,
  }),

  // 8. Chemical / environmental resistance
  chemical_resistance: z.object({
    solvent_resistance: z.record(z.string(), ratedValueSchema).default({}),
    weathering_uv: ratedValueSchema,
    hydrolysis_resistance: ratedValueSchema,
    flammability_ul94: ratedValueSchema,
  }),

  // 9. Processing
  processing: z.object({
    processing_methods: z.array(z.string()).default([]),
    processing_temp_range: propertyValueSchema,
    drying_required: z.boolean().nullable(),
    shrinkage_rate: propertyValueSchema,
  }),

  // 10. Applications
  applications: z.array(applicationSchema).default([]),

  // 11. Environmental & recycling
  environmental: z.object({
    recyclable: z.boolean().nullable(),
    biodegradable: z.boolean().nullable(),
    degradation_pathway: z.string().nullable(),
    environmental_notes: z.string().nullable(),
  }),

  // 12. References
  references: z.array(z.string()).default([]), // citation keys into references.bib

  // 13. Media
  media: z.object({
    hero_image: imageObjectSchema.nullable().default(null),
    diagrams: z.array(imageObjectSchema).default([]),
    structure_render_2d: structureImageSchema.nullable().default(null),
    structure_render_3d: structureImageSchema.nullable().default(null),
  }),
});

export type PolymerData = z.infer<typeof polymerDataSchema>;
