import { createClient } from '@sanity/client'

export default createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_API_READ_TOKEN,
})
