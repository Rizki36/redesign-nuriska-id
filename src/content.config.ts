import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  // Load Markdown and MDX files in the `src/content/news/` directory
  loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    category: z.enum(['pengumuman', 'akademik', 'kegiatan', 'prestasi']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string(),
    featured: z.boolean().default(false),
    slug: z.string().optional(), // Custom slug for the URL (optional, defaults to file name)
  }),
});

export const collections = {
  news,
};