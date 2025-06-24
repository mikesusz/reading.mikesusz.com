import { defineCollection, z } from "astro:content";

const books = defineCollection({
	type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    date: z.string(),
		display: z.boolean().optional(),
		read: z.boolean().optional()
  }),
});

export const collections = { books };