import { createClient } from '@sanity/client'
import groq from 'groq'
import client from './sanity'

export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  publishedAt: string
  excerpt: string
  content: any[]
  author: {
    name: string
  }
  categories: {
    title: string
  }[]
  featured?: boolean
}

// Mock data for fallback when Sanity is not configured
const mockPosts: Post[] = [
  {
    _id: 'mock-1',
    title: 'Why AI Governance Matters Now',
    slug: { current: 'why-ai-governance-matters-now' },
    publishedAt: '2026-03-12',
    excerpt: 'With the EU AI Act taking effect and enterprise AI adoption accelerating, the window for proactive governance is closing.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Enterprise AI adoption has moved from experimentation to production at unprecedented speed. Yet governance structures have not kept pace.' }]
      }
    ],
    author: { name: 'Brian Burke' },
    categories: [{ title: 'Governance' }],
    featured: true
  },
  {
    _id: 'mock-2',
    title: 'The AI Decision Visibility Assessment Explained',
    slug: { current: 'decision-visibility-assessment-explained' },
    publishedAt: '2026-03-11',
    excerpt: 'Our signature assessment helps organizations understand how AI decisions are made, documented, and communicated.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'The AI Decision Visibility Assessment (DVA) is a structured evaluation methodology designed to answer a fundamental question: can your organization explain how its AI systems make decisions?' }]
      }
    ],
    author: { name: 'Brian Burke' },
    categories: [{ title: 'Assessment' }],
    featured: false
  }
]

async function fetchWithFallback<T>(query: string, params?: any): Promise<T> {
  try {
    // Check if Sanity is configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
      console.log('Sanity not configured, using mock data')
      throw new Error('Sanity not configured')
    }
    
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    console.log('Sanity fetch failed, using mock data:', error instanceof Error ? error.message : 'Unknown error')
    
    // Return appropriate mock data based on the query
    if (query.includes('featured')) {
      return mockPosts.filter(post => post.featured) as T
    } else if (query.includes('slug.current')) {
      const slug = params?.slug
      const post = mockPosts.find(p => p.slug.current === slug)
      return (post || mockPosts[0]) as T // Return first mock post if not found
    } else {
      return mockPosts as T
    }
  }
}

export async function getPosts(): Promise<Post[]> {
  return fetchWithFallback<Post[]>(
    groq`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      content,
      author->{name},
      categories[]->{title},
      featured
    }`
  )
}

export async function getPost(slug: string): Promise<Post> {
  return fetchWithFallback<Post>(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      content,
      author->{name},
      categories[]->{title},
      featured
    }`,
    { slug }
  )
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return fetchWithFallback<Post[]>(
    groq`*[_type == "post" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      author->{name},
      categories[]->{title},
      featured
    }[0...3]`
  )
}
