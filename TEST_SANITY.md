# How to Test Sanity CMS Integration

## Quick Test Options

### 1. **Test Script (Recommended)**
Run the test script to verify Sanity connection:
```bash
npx tsx scripts/test-sanity.ts
```

This will show:
- ✅ Environment variables status
- ✅ Sanity connection test
- ✅ Mock data fallback verification

### 2. **Development Server Test**
Start the dev server to see the blog in action:
```bash
npm run dev
```
Then visit:
- http://localhost:3000/insights (blog listing)
- http://localhost:3000/insights/why-ai-governance-matters-now (individual post)

### 3. **Manual Testing Steps**

#### Step 1: Check Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-actual-read-token
```

#### Step 2: Set Up Sanity Project
```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Create project
sanity init

# Start studio
npx sanity start
```

#### Step 3: Test Connection
```bash
# Test with real Sanity credentials
npx tsx scripts/test-sanity.ts
```

#### Step 4: Migrate Content (Optional)
```bash
# Update scripts/migrate-to-sanity.ts with your credentials
# Then run:
npx tsx scripts/migrate-to-sanity.ts
```

## Expected Results

### ✅ **Working Correctly When:**
- Environment variables are set properly
- Sanity project exists and is accessible
- You see real blog posts from Sanity
- No "Sanity fetch failed" messages in console

### ⚠️ **Fallback Mode When:**
- Environment variables are not set
- Sanity project doesn't exist
- Network issues prevent connection
- You see "Sanity fetch failed, using mock data" messages
- Blog shows sample content (this is normal for testing)

### ❌ **Error When:**
- Build fails with TypeScript errors
- Pages show blank content
- Console shows undefined errors

## Testing Checklist

- [ ] Environment variables configured
- [ ] Sanity CLI installed
- [ ] Sanity project created
- [ ] Test script runs without errors
- [ ] Development server starts
- [ ] Blog pages load with content
- [ ] Individual post pages work
- [ ] Rich text formatting displays correctly

## Common Issues & Solutions

### Issue: "Sanity fetch failed"
**Solution**: This is normal during initial setup. The site falls back to mock data.

### Issue: Build fails
**Solution**: Check TypeScript errors in console. Most are related to missing environment variables.

### Issue: Blank pages
**Solution**: Ensure mock data is properly structured in `lib/posts.ts`

### Issue: PortableText errors
**Solution**: Install `@portabletext/react` package (already installed)

## Next Steps After Testing

1. **Set up real Sanity project** if you want to use actual CMS
2. **Configure environment variables** with real project details
3. **Run migration script** to move existing content
4. **Test content management** in Sanity Studio
5. **Deploy to production** with real environment variables

## Production Deployment

When ready to deploy with real Sanity:

1. Set environment variables in your hosting platform
2. Remove or comment out mock data fallbacks
3. Test with real Sanity connection
4. Deploy and verify live site

---

**Note**: The current setup includes robust fallback mechanisms, so the site will work even without Sanity configured. This makes testing and development much easier!
