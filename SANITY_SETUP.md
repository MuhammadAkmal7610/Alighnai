# Sanity CMS Integration

This project now includes Sanity CMS for managing blog posts and insights content.

## Setup Instructions

### 1. Create Sanity Project

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Create a new Sanity project
sanity init

# Choose:
# - Create new project
# - Use default schema configuration
# - Select dataset (production)
# - Select project (will be created automatically)
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-sanity-read-token
```

Get these values from:
- **Project ID**: From your Sanity dashboard → Project → Settings → API
- **Dataset**: Usually "production"
- **Read Token**: From your Sanity dashboard → Project → Settings → API → Tokens → Add API Token

### 3. Run Sanity Studio

```bash
# Start the Sanity Studio (content management interface)
npx sanity start

# This will open a local development studio at http://localhost:3333
```

### 4. Migrate Existing Content

Update the migration script with your actual Sanity credentials:

```bash
# Edit scripts/migrate-to-sanity.ts
# Replace 'your-project-id' and 'your-sanity-token' with actual values

# Run the migration
npx tsx scripts/migrate-to-sanity.ts
```
Y
### 5. Start Development

```bash
# Start the Next.js development server
npm run dev
```

## Content Structure

### Blog Posts Schema
- **Title**: Post title
- **Slug**: URL-friendly identifier
- **Published At**: Publication date
- **Excerpt**: Short description for listings
- **Content**: Rich text content with formatting
- **Author**: Reference to author document
- **Categories**: Multiple category references
- **Featured**: Boolean for highlighting important posts

### Authors Schema
- **Name**: Author name
- **Image**: Profile picture
- **Bio**: Short biography

### Categories Schema
- **Title**: Category name
- **Description**: Category description

## Features

- **Rich Text Editor**: Full formatting support with PortableText
- **Image Handling**: Built-in image optimization
- **Real-time Preview**: See changes instantly
- **SEO Optimized**: Automatic metadata generation
- **Responsive Design**: Mobile-friendly content display
- **Search**: Built-in search functionality
- **Version Control**: Track content changes

## Usage

### Adding New Posts

1. Open Sanity Studio (`npx sanity start`)
2. Navigate to "Blog Post" in the sidebar
3. Click "New blog post"
4. Fill in the required fields
5. Save and publish

### Managing Categories

1. Navigate to "Category" in Sanity Studio
2. Create or edit categories
3. Assign categories to posts

### Managing Authors

1. Navigate to "Author" in Sanity Studio
2. Create author profiles
3. Assign authors to posts

## Deployment

### Netlify

1. Add environment variables in Netlify dashboard
2. Connect your repository
3. Deploy automatically on push

### Vercel

1. Add environment variables in Vercel dashboard
2. Connect your repository
3. Deploy automatically on push

## API Endpoints

The following functions are available in `lib/posts.ts`:

- `getPosts()`: Fetch all posts
- `getPost(slug)`: Fetch a single post
- `getFeaturedPosts()`: Fetch featured posts

## Customization

### Styling

Content is styled using Tailwind CSS classes in the PortableText components. Modify the component mapping in `app/insights/[slug]/page.tsx` to customize styling.

### Schema

Modify the schema files in `schemas/` to add new fields or change existing ones.

### Queries

Update the GROQ queries in `lib/posts.ts` to change what data is fetched.

## Troubleshooting

### Common Issues

1. **404 Errors**: Check that your environment variables are correctly set
2. **Missing Content**: Ensure content is published in Sanity Studio
3. **Build Errors**: Verify all required fields are filled in Sanity

### Debug Mode

Add debug logging to `lib/posts.ts`:

```typescript
console.log('Fetching posts...')
const posts = await client.fetch(query)
console.log('Posts:', posts)
```

## Support

For Sanity-specific issues:
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Community](https://www.sanity.io/community)

For project-specific issues:
- Check the GitHub Issues
- Review the code comments
