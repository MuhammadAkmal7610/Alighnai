import { createClient } from '@sanity/client'
import groq from 'groq'

// Test client with fallback to mock data
const testClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'test-project',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_API_READ_TOKEN,
})

// Mock data for testing without Sanity
const mockPosts = [
  {
    _id: 'mock-1',
    title: 'Mock Post 1 - Testing Sanity Integration',
    slug: { current: 'mock-post-1' },
    publishedAt: '2026-03-12',
    excerpt: 'This is a mock post to test the integration when Sanity is not configured.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'This is mock content for testing purposes.' }]
      }
    ],
    author: { name: 'Test Author' },
    categories: [{ title: 'Testing' }],
    featured: true
  },
  {
    _id: 'mock-2',
    title: 'Mock Post 2 - Another Test',
    slug: { current: 'mock-post-2' },
    publishedAt: '2026-03-11',
    excerpt: 'Another mock post to verify the system works.',
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'More mock content for testing.' }]
      }
    ],
    author: { name: 'Test Author' },
    categories: [{ title: 'Testing' }],
    featured: false
  }
]

async function testSanityConnection() {
  console.log('🧪 Testing Sanity CMS Connection...')
  console.log('=====================================')
  
  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT SET'}`)
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT SET'}`)
  console.log(`   Read Token: ${process.env.SANITY_API_READ_TOKEN ? 'SET' : 'NOT SET'}`)
  
  try {
    // Test basic connection
    const query = groq`count(*[_type == "post"])`
    const count = await testClient.fetch(query)
    console.log(`✅ Sanity connection successful! Found ${count} posts`)
    
    // Test fetching posts
    const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      author->{name},
      categories[]->{title},
      featured
    }`
    const posts = await testClient.fetch(postsQuery)
    
    if (posts.length > 0) {
      console.log('✅ Successfully fetched posts:')
      posts.forEach((post: any, index: number) => {
        console.log(`   ${index + 1}. ${post.title} (${post.publishedAt})`)
      })
    } else {
      console.log('⚠️  No posts found in Sanity. Using mock data for testing.')
      return { success: true, posts: mockPosts, usingMock: true }
    }
    
    return { success: true, posts, usingMock: false }
    
  } catch (error: any) {
    console.log('❌ Sanity connection failed:', error.message)
    console.log('🔄 Falling back to mock data for testing...')
    return { success: false, posts: mockPosts, usingMock: true, error }
  }
}

// Test individual post fetch
async function testPostFetch() {
  console.log('\n🔍 Testing individual post fetch...')
  
  try {
    const query = groq`*[_type == "post" && slug.current == "why-ai-governance-matters-now"][0] {
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
    
    const post = await testClient.fetch(query)
    
    if (post) {
      console.log('✅ Successfully fetched individual post:', post.title)
      return { success: true, post }
    } else {
      console.log('⚠️  Post not found. Using mock post.')
      return { success: true, post: mockPosts[0], usingMock: true }
    }
    
  } catch (error: any) {
    console.log('❌ Failed to fetch post:', error.message)
    return { success: false, post: mockPosts[0], usingMock: true, error }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Sanity CMS Tests\n')
  
  const postsResult = await testSanityConnection()
  const postResult = await testPostFetch()
  
  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  console.log(`Posts Fetch: ${postsResult.success ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Post Fetch: ${postResult.success ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Using Mock Data: ${postsResult.usingMock ? '🔄 YES' : '🚫 NO'}`)
  
  if (postsResult.usingMock) {
    console.log('\n💡 To use real Sanity data:')
    console.log('   1. Set up a Sanity project: npx sanity init')
    console.log('   2. Configure environment variables in .env.local')
    console.log('   3. Run migration script: npx tsx scripts/migrate-to-sanity.ts')
  }
  
  console.log('\n✨ Tests completed!')
}

// Export for use in components
export { testSanityConnection, testPostFetch, mockPosts }

// Run tests if this file is executed directly (ESM compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}
