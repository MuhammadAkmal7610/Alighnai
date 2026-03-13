import { createClient } from '@sanity/client'
import postsData from '../data/posts.json'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-12',
  token: 'your-sanity-token',
})

async function migratePosts() {
  try {
    // Create default author
    const author = await client.createIfNotExists({
      _id: 'author-brian-burke',
      _type: 'author',
      name: 'Brian Burke',
      bio: 'Founder and Principal Advisor at ByteStream Strategies',
    })

    // Create categories
    const categories = {
      'Governance': await client.createIfNotExists({
        _id: 'category-governance',
        _type: 'category',
        title: 'Governance',
        description: 'AI governance frameworks and implementation',
      }),
      'Assessment': await client.createIfNotExists({
        _id: 'category-assessment',
        _type: 'category',
        title: 'Assessment',
        description: 'AI governance assessments and evaluations',
      }),
      'Strategy': await client.createIfNotExists({
        _id: 'category-strategy',
        _type: 'category',
        title: 'Strategy',
        description: 'Strategic approaches to AI governance',
      }),
      'Compliance': await client.createIfNotExists({
        _id: 'category-compliance',
        _type: 'category',
        title: 'Compliance',
        description: 'Regulatory compliance and requirements',
      }),
      'Industry': await client.createIfNotExists({
        _id: 'category-industry',
        _type: 'category',
        title: 'Industry',
        description: 'Industry-specific AI governance insights',
      }),
    }

    // Migrate posts
    for (const postData of postsData) {
      const categoryKey = postData.tag as keyof typeof categories
      const category = categories[categoryKey] || categories['Governance']

      const content = postData.content.split('\n\n').map(paragraph => {
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          return {
            _type: 'block',
            style: 'h3',
            children: [{ _type: 'span', text: paragraph.replace(/\*\*/g, '') }],
          }
        }
        if (paragraph.startsWith('**')) {
          const parts = paragraph.split('**')
          return {
            _type: 'block',
            style: 'normal',
            children: [
              { _type: 'span', marks: ['strong'], text: parts[1] },
              { _type: 'span', text: parts[2] || '' },
            ],
          }
        }
        if (/^\d+\./.test(paragraph)) {
          const items = paragraph.split('\n').filter(Boolean)
          return {
            _type: 'block',
            style: 'normal',
            children: items.map((item, i) => ({
              _type: 'span',
              text: `${i + 1}. ${item.replace(/^\d+\.\s*/, '')}\n`,
            })),
          }
        }
        return {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: paragraph }],
        }
      })

      await client.createIfNotExists({
        _id: `post-${postData.slug}`,
        _type: 'post',
        title: postData.title,
        slug: {
          _type: 'slug',
          current: postData.slug,
        },
        publishedAt: postData.date,
        excerpt: postData.excerpt,
        content,
        author: { _type: 'reference', _ref: author._id },
        categories: [{ _type: 'reference', _ref: category._id }],
        featured: postData.slug === 'why-ai-governance-matters-now',
      })
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migratePosts()
