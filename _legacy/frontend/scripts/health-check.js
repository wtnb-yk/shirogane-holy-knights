#!/usr/bin/env node

/**
 * Health check script for frontend performance optimizations
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Frontend Health Check...\n');

// Check if Next.js config loads properly
try {
  require('../next.config.js');
  console.log('✅ Next.js configuration loads successfully');
} catch (error) {
  console.log('❌ Next.js configuration error:', error.message);
  process.exit(1);
}

// Check if performance optimizations are in place
const nextConfigPath = path.join(__dirname, '../next.config.js');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

const checks = [
  {
    name: 'Bundle splitting configuration',
    test: () => nextConfigContent.includes('splitChunks'),
    fix: 'Ensure webpack optimization is configured in next.config.js'
  },
  {
    name: 'Image optimization settings',
    test: () => nextConfigContent.includes('formats') && nextConfigContent.includes('webp'),
    fix: 'Configure image formats in next.config.js'
  },
  {
    name: 'Package import optimization',
    test: () => nextConfigContent.includes('optimizePackageImports'),
    fix: 'Add optimizePackageImports to experimental config'
  }
];

let allPassed = true;

checks.forEach(check => {
  if (check.test()) {
    console.log(`✅ ${check.name}`);
  } else {
    console.log(`❌ ${check.name}`);
    console.log(`   Fix: ${check.fix}`);
    allPassed = false;
  }
});

// Check if performance components exist
const performanceFiles = [
  'src/components/ui/OptimizedImage.tsx',
  'src/hooks/usePerformanceMonitor.ts',
  'src/hooks/useOptimizedCallback.ts',
  'src/components/common/DynamicComponents.tsx'
];

console.log('\n📁 Performance Components:');
performanceFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing performance component`);
    allPassed = false;
  }
});

// Check if documentation exists
const docsPath = path.join(__dirname, '../docs/PERFORMANCE.md');
if (fs.existsSync(docsPath)) {
  console.log('✅ Performance documentation exists');
} else {
  console.log('❌ Performance documentation missing');
  allPassed = false;
}

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 All performance optimizations are in place!');
  console.log('\n💡 To analyze bundle size, run:');
  console.log('   pnpm bundle-analysis');
  console.log('   pnpm analyze:install (for detailed analysis)');
} else {
  console.log('⚠️  Some optimizations are missing. Please review the items above.');
  process.exit(1);
}