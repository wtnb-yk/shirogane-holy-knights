#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Bundle analysis script to identify optimization opportunities
 */
class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(__dirname, '../.next');
    this.staticDir = path.join(this.buildDir, 'static');
  }

  /**
   * Get file size in a human readable format
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Recursively get all files in a directory
   */
  getAllFiles(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) {
      return arrayOfFiles;
    }

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }

  /**
   * Analyze JavaScript bundles
   */
  analyzeJSBundles() {
    const jsDir = path.join(this.staticDir, 'chunks');
    if (!fs.existsSync(jsDir)) {
      console.log('❌ No JavaScript bundles found. Run `pnpm build` first.');
      return;
    }

    const jsFiles = this.getAllFiles(jsDir).filter(file => file.endsWith('.js'));
    const bundles = jsFiles.map(file => {
      const stats = fs.statSync(file);
      const relativePath = path.relative(this.buildDir, file);
      return {
        name: relativePath,
        size: stats.size,
        formattedSize: this.formatBytes(stats.size)
      };
    });

    // Sort by size (largest first)
    bundles.sort((a, b) => b.size - a.size);

    console.log('\n📦 JavaScript Bundle Analysis:');
    console.log('================================');
    
    const totalSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0);
    console.log(`Total JS Size: ${this.formatBytes(totalSize)}\n`);

    bundles.slice(0, 10).forEach((bundle, index) => {
      const percentage = ((bundle.size / totalSize) * 100).toFixed(1);
      console.log(`${index + 1}. ${bundle.name}`);
      console.log(`   Size: ${bundle.formattedSize} (${percentage}%)\n`);
    });

    // Identify large bundles (>100KB)
    const largeBundles = bundles.filter(bundle => bundle.size > 100 * 1024);
    if (largeBundles.length > 0) {
      console.log('⚠️  Large bundles (>100KB):');
      largeBundles.forEach(bundle => {
        console.log(`   - ${bundle.name}: ${bundle.formattedSize}`);
      });
      console.log('\n💡 Consider code splitting for these bundles.\n');
    }
  }

  /**
   * Analyze CSS bundles
   */
  analyzeCSSBundles() {
    const cssDir = path.join(this.staticDir, 'css');
    if (!fs.existsSync(cssDir)) {
      console.log('❌ No CSS bundles found.');
      return;
    }

    const cssFiles = this.getAllFiles(cssDir).filter(file => file.endsWith('.css'));
    const bundles = cssFiles.map(file => {
      const stats = fs.statSync(file);
      const relativePath = path.relative(this.buildDir, file);
      return {
        name: relativePath,
        size: stats.size,
        formattedSize: this.formatBytes(stats.size)
      };
    });

    bundles.sort((a, b) => b.size - a.size);

    console.log('\n🎨 CSS Bundle Analysis:');
    console.log('=======================');
    
    const totalSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0);
    console.log(`Total CSS Size: ${this.formatBytes(totalSize)}\n`);

    bundles.forEach((bundle, index) => {
      const percentage = ((bundle.size / totalSize) * 100).toFixed(1);
      console.log(`${index + 1}. ${bundle.name}`);
      console.log(`   Size: ${bundle.formattedSize} (${percentage}%)\n`);
    });
  }

  /**
   * Provide optimization recommendations
   */
  provideRecommendations() {
    console.log('\n💡 Optimization Recommendations:');
    console.log('=================================');
    console.log('1. Use dynamic imports for heavy components');
    console.log('2. Implement code splitting at route level');
    console.log('3. Remove unused dependencies');
    console.log('4. Use tree shaking for libraries');
    console.log('5. Optimize images with Next.js Image component');
    console.log('6. Enable gzip/brotli compression');
    console.log('7. Use bundle analyzer: `pnpm analyze`');
    console.log('\n🚀 Run `pnpm analyze` for detailed bundle visualization.');
  }

  /**
   * Run the complete analysis
   */
  run() {
    console.log('🔍 Analyzing Next.js Bundle...\n');
    
    if (!fs.existsSync(this.buildDir)) {
      console.log('❌ Build directory not found. Run `pnpm build` first.');
      return;
    }

    this.analyzeJSBundles();
    this.analyzeCSSBundles();
    this.provideRecommendations();
  }
}

// Run the analyzer
const analyzer = new BundleAnalyzer();
analyzer.run();