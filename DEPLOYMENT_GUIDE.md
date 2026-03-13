# 🚀 Vercel Deployment & Sanity Setup Guide

## ✅ **Deployment Status: SUCCESS**

Your website is now live at: **https://alignai-website.vercel.app**

---

## 🎯 **Next Steps: Make Sanity Work with Production**

### **1. Set Up Sanity Project**
```bash
# Create a new Sanity project
npx sanity init

# Or connect to existing project
npx sanity init --project your-project-id --dataset production
```

### **2. Configure Vercel Environment Variables**

Go to your Vercel dashboard: https://vercel.com/dashboard

Add these Environment Variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-12
SANITY_API_READ_TOKEN=your-actual-read-token
SANITY_API_WRITE_TOKEN=your-actual-write-token
```

### **3. Deploy Sanity Studio**

Option A: **Embedded Studio** (Recommended)
```bash
# The studio is already configured to embed in Next.js
# Just deploy the Next.js app - studio will be at /studio
npx vercel --prod
```

Option B: **Separate Studio Deployment**
```bash
# Deploy studio separately
cd sanity
npx vercel --prod
```

### **4. Test Production Setup**

```bash
# Test Sanity connection in production
npx tsx scripts/test-sanity.ts

# Test specific post fetch
curl https://alignai-website.vercel.app/api/posts
```

---

## 🔧 **Sanity Studio URLs**

After setup, your CMS will be available at:

- **Embedded**: https://alignai-website.vercel.app/studio
- **Separate**: https://your-studio-url.vercel.app (if deployed separately)

---

## 📊 **Current Deployment Info**

### **✅ What's Working:**
- Static site generation: ✅
- Blog post routing: ✅
- Mock data fallbacks: ✅
- Vercel deployment: ✅
- Build optimization: ✅

### **⚙️ What Needs Configuration:**
- Sanity project connection
- Environment variables in Vercel
- Real content vs mock data

---

## 🎬 **Testing Checklist**

### **Before Client Handover:**

**1. Sanity Setup**
- [ ] Create Sanity project
- [ ] Configure schemas
- [ ] Add sample content
- [ ] Test studio functionality

**2. Vercel Configuration**
- [ ] Add environment variables
- [ ] Deploy with real Sanity connection
- [ ] Test production site
- [ ] Verify CMS studio access

**3. Final Testing**
- [ ] Test content creation
- [ ] Test content updates
- [ ] Test image uploads
- [ ] Test static regeneration

---

## 🚨 **Important Notes**

### **Current Status:**
- Site is **live and working** with mock data
- Static export is **properly configured**
- All **dynamic routes** are generating correctly
- **Build process** is optimized and successful

### **For Client:**
1. **Set up Sanity project** first
2. **Configure Vercel variables** second
3. **Test with real content** third
4. **Deploy final version** fourth

The foundation is **100% ready** - you just need to connect real Sanity data!

---

## 📞 **Support**

**Sanity Documentation**: https://www.sanity.io/docs
**Vercel Documentation**: https://vercel.com/docs
**Project Repository**: https://github.com/obaid-ur-rahman-zia/alignai-website

---

**🎉 Your AlignAI website is successfully deployed and ready for CMS integration!**
