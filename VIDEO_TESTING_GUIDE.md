# Video Testing Guide - AlignAI Website

## 🎥 Ready to Record!

Your development server is running at: **http://localhost:3002**

---

## 📋 Testing Script for Video

### 1. **Introduction (30 seconds)**
```
"Hi, I'm demonstrating the AlignAI website with CMS integration. 
The site is built with Next.js 15 and Sanity CMS, and I've prepared it 
for client handover. Let me show you what's working..."
```

### 2. **Show Website is Working (1 minute)**
```
• Open http://localhost:3002
• Show home page loads perfectly
• Navigate to About page (/about)
• Show Contact page (/contact)
• Show Services page (/services)
• Mention: "All pages are working with static generation"
```

### 3. **Demonstrate Blog/CMS Features (2 minutes)**
```
• Navigate to Insights page (/insights)
• Show blog listing with mock data
• Click on "Why AI Governance Matters Now"
• Show individual blog post page
• Point out rich text formatting
• Mention: "This is using Sanity CMS with fallback to mock data"
```

### 4. **Show Development Setup (1 minute)**
```
• Show terminal with running dev server
• Run: npm run build (show successful build)
• Show: "Build completed successfully with 12 pages"
• Mention: "Static export is working perfectly"
```

### 5. **Demonstrate CMS Setup (2 minutes)**
```
• Run: npx sanity --version (show CLI working)
• Run: npx sanity init --help (show options available)
• Show .env.local file exists
• Mention: "Client can run 'sanity init' to connect to real CMS"
```

### 6. **Show Documentation (30 seconds)**
```
• Open CMS_HANDOVER.md
• Show comprehensive documentation
• Show setup scripts in scripts/ folder
• Mention: "Everything is documented for easy handover"
```

### 7. **Conclusion (30 seconds)**
```
"The website is production-ready with:
• Static site generation working
• CMS integration prepared
• Comprehensive documentation
• Setup scripts for easy onboarding

The client can immediately start developing CMS features!"
```

---

## 🎯 Key Demo Points

### **What to Emphasize:**
- ✅ **Build Success**: `npm run build` works perfectly
- ✅ **Static Export**: 12 pages generated including dynamic routes
- ✅ **CMS Ready**: Sanity CLI installed and configured
- ✅ **Fallback System**: Works with mock data without CMS
- ✅ **Documentation**: Complete handover guide provided

### **Commands to Run on Camera:**
```bash
# 1. Show development server
npm run dev

# 2. Show build success
npm run build

# 3. Show Sanity CLI
npx sanity --version

# 4. Show setup options
npx sanity init --help

# 5. Show test script
npx tsx scripts/test-sanity.ts
```

### **Pages to Visit:**
- http://localhost:3002 (Home)
- http://localhost:3002/about (About)
- http://localhost:3002/insights (Blog Listing)
- http://localhost:3002/insights/why-ai-governance-matters-now (Blog Post)

---

## 🚀 Quick Start for Recording

### **Right Now:**
1. **Website is running**: http://localhost:3002
2. **Browser preview available**: Click the preview button above
3. **Terminal ready**: Commands are prepared

### **Recording Tips:**
- Keep terminal visible to show commands
- Use browser preview for smooth navigation
- Mention the static export success
- Highlight the fallback system
- Show the comprehensive documentation

---

## 📁 Important Files to Show

- `CMS_HANDOVER.md` - Complete documentation
- `scripts/setup-cms.ps1` - Automated setup
- `package.json` - Dependencies configured
- `next.config.ts` - Static export enabled

---

## ⚡ Demo Flow Summary

1. **Website Demo** (2 min) → Show working site
2. **Build Demo** (1 min) → Show static export
3. **CMS Demo** (2 min) → Show Sanity setup
4. **Documentation** (1 min) → Show handover guide
5. **Conclusion** (30 sec) → Summarize readiness

**Total Video Time**: ~6.5 minutes

---

**🎬 You're ready to record! The development server is running and everything is working perfectly.**
