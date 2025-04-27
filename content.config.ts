import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        tags: z.array(z.string()).optional(),
        description: z.string().optional(),
        meta: z.object({
          image: z.string().optional(),
          category: z.object({
            main: z.string(),
            sub: z.string().optional()
          }),
          readingTime: z.number().optional(),
          featured: z.boolean().optional(),
          author: z.object({
            name: z.string(),
            image: z.string().optional()
          }).optional()
        }).optional()
      })
    })
  }
})
