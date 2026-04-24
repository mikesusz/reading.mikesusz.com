import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const books = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
	schema: z.object({
		title: z.string(),
		authors: z.array(z.string()),
		date: z.string(),
		display: z.boolean().optional(),
		read: z.boolean().optional(),
		series: z.string().optional(),
		bookNumber: z.number().int().optional(),
		rating: z.number().min(1).max(5).optional()
	})
});

export const collections = { books };
