# CMS Development Handover Guide

## Project Overview
The AlignAI website is built with Next.js 15 and Sanity CMS for content management. The project is configured for static export but includes robust CMS integration for dynamic content management.

## Current Status
✅ **Working Features:**
- Static site generation with mock data fallbacks
- Sanity CMS client configuration
- Blog posts with dynamic routing
- Content schemas (posts, authors, categories)
- Image optimization with Sanity URLs
- PortableText rendering for rich content

⚠️ **Known Limitations:**
- Sanity Studio temporarily disabled due to React version compatibility
- Static export requires predefined slugs for dynamic routes
- CMS Studio runs in development mode only

## Setup Instructions

### 1. Environment Configuration
Create `.env.local` with:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-12
SANITY_API_READ_TOKEN=your-read-token
SANITY_API_WRITE_TOKEN=your-write-token
```

### 2. Sanity Project Setup
```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Initialize Sanity project
sanity init

# Start development studio
npx sanity start
```

### 3. Development Workflow
```bash
# Start Next.js development server
npm run dev

# Start Sanity Studio (separate terminal)
npx sanity dev

# Build for production
npm run build

# Start production server
npm start
```

## Architecture Overview

### Content Structure
- **Posts**: Blog articles with rich text, metadata, and categorization
- **Authors**: Writer profiles with names and bios
- **Categories**: Content categorization system

### Key Files & Directories
```
├── app/
│   ├── insights/[slug]/page.tsx     # Dynamic blog post pages
│   └── insights/page.tsx            # Blog listing page
├── lib/
│   ├── posts.ts                     # Content fetching logic
│   └── sanity.ts                    # Sanity client configuration
├── sanity/
│   ├── lib/
│   │   ├── client.ts                # Sanity client setup
│   │   └── image.ts                 # Image URL generation
│   ├── schemas/
│   │   ├── post.ts                  # Post schema definition
│   │   ├── author.ts                # Author schema definition
│   │   └── category.ts              # Category schema definition
│   └── config.ts                    # Sanity configuration
└── components/
    └── CTASection.tsx               # Reusable UI components
```

### Data Flow
1. **Static Generation**: `generateStaticParams()` creates static routes
2. **Content Fetching**: `lib/posts.ts` handles Sanity API calls with fallbacks
3. **Rendering**: Components use PortableText for rich content display
4. **Fallback System**: Mock data ensures site works without CMS

## CMS Integration Details

### Content Fetching Pattern
```typescript
// lib/posts.ts - Robust fetching with fallbacks
async function fetchWithFallback<T>(query: string, params?: any): Promise<T> {
  try {
    // Check if Sanity is configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      throw new Error('Sanity not configured')
    }
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    // Return mock data for development/testing
    return mockData as T
  }
}
```

### Image Handling
```typescript
// sanity/lib/image.ts - Optimized image URLs
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
    .width(800)
    .format('webp')
    .quality(80)
}
```

### Rich Text Rendering
```typescript
// Using @portabletext/react for structured content
<PortableText
  value={post.content}
  components={{
    marks: {
      link: ({ children, value }) => (
        <a href={value.href} target="_blank">{children}</a>
      )
    }
  }}
/>
```

## Development Tasks for CMS Team

### Phase 1: Sanity Studio Setup
1. **Restore Studio Integration**
   - Fix React version compatibility issues
   - Update to Next.js 16 or compatible Sanity version
   - Test Studio functionality

2. **Content Migration**
   - Set up production Sanity project
   - Configure schemas in Studio
   - Migrate existing mock content
   - Test content creation/editing

### Phase 2: Enhanced Features
1. **Dynamic Content**
   - Implement ISR (Incremental Static Regeneration)
   - Add content preview functionality
   - Set up webhooks for content updates

2. **Media Management**
   - Configure image optimization
   - Set up CDN for media assets
   - Implement alt text management

3. **SEO & Metadata**
   - Dynamic sitemap generation
   - Meta tag optimization
   - Structured data implementation

### Phase 3: Advanced Features
1. **Multi-language Support**
   - Internationalization setup
   - Content localization
   - Language-specific routing

2. **Performance Optimization**
   - Caching strategies
   - CDN configuration
   - Bundle optimization

## Testing Procedures

### Content Testing
```bash
# Test Sanity connection
npx tsx scripts/test-sanity.ts

# Test content fetching
curl http://localhost:3000/api/posts

# Test static generation
npm run build && npm start
```

### Studio Testing
```bash
# Start Studio in development
npx sanity dev

# Access Studio at http://localhost:3000/studio
```

## Deployment Considerations

### Static Export Configuration
- `next.config.ts` configured for static export
- Dynamic routes require `generateStaticParams()`
- Images optimized for static hosting

### Environment Variables Required
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`

### Hosting Requirements
- Static site hosting (Netlify, Vercel, etc.)
- Environment variable management
- CDN for optimal performance

## Troubleshooting Guide

### Common Issues
1. **Build Failures**
   - Check environment variables
   - Verify Sanity project access
   - Ensure all dependencies installed

2. **Content Not Loading**
   - Test Sanity connection with script
   - Check API token permissions
   - Verify dataset configuration

3. **Studio Not Working**
   - React version compatibility issue
   - Check next-sanity installation
   - Verify Studio configuration

### Debug Commands
```bash
# Check Sanity connection
npx tsx scripts/test-sanity.ts

# Verify environment
echo $NEXT_PUBLIC_SANITY_PROJECT_ID

# Test build process
npm run build --debug
```

## Next Steps

1. **Immediate Actions**
   - Set up Sanity project
   - Configure environment variables
   - Test content management workflow

2. **Development Priorities**
   - Restore Studio functionality
   - Implement content preview
   - Set up deployment pipeline

3. **Long-term Considerations**
   - Performance monitoring
   - Content governance policies
   - Scalability planning

## Support Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **PortableText Reference**: https://github.com/portabletext/react-portabletext

---

**Note**: This project includes comprehensive fallback systems, ensuring the website functions correctly even without CMS configuration. This makes development and testing much more flexible.
