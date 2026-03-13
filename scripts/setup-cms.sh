#!/bin/bash

# CMS Development Setup Script
# Run this script to set up the development environment for CMS features

echo "🚀 Setting up CMS Development Environment..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Sanity CLI is installed
if ! command -v sanity &> /dev/null; then
    echo "🔧 Installing Sanity CLI..."
    npm install -g @sanity/cli
else
    echo "✅ Sanity CLI is already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << EOF
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-12
SANITY_API_READ_TOKEN=your-read-token
SANITY_API_WRITE_TOKEN=your-write-token
EOF
    echo "✅ Created .env.local template"
    echo "⚠️  Please update the environment variables with your Sanity project details"
else
    echo "✅ .env.local already exists"
fi

# Test the current setup
echo "🧪 Testing current setup..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the error messages above."
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update .env.local with your Sanity project details"
echo "2. Run 'sanity init' to create/connect to your Sanity project"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Run 'npx sanity dev' to start the Sanity Studio"
echo ""
echo "📚 For detailed instructions, see CMS_HANDOVER.md"
echo ""
echo "✨ Setup complete!"
