#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating project configuration...\n');

let hasErrors = false;

// Check PostCSS config
function checkPostCSSConfig() {
  console.log('📝 Checking PostCSS configuration...');
  const postcssPath = path.join(process.cwd(), 'postcss.config.js');
  
  if (!fs.existsSync(postcssPath)) {
    console.error('❌ postcss.config.js not found');
    hasErrors = true;
    return;
  }
  
  try {
    const config = require(postcssPath);
    if (!config.plugins) {
      console.error('❌ PostCSS config missing plugins key');
      hasErrors = true;
    } else {
      console.log('✅ PostCSS config is valid');
    }
  } catch (error) {
    console.error('❌ PostCSS config has syntax errors:', error.message);
    hasErrors = true;
  }
}

// Check Tailwind config
function checkTailwindConfig() {
  console.log('🎨 Checking Tailwind configuration...');
  const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');
  
  if (!fs.existsSync(tailwindPath)) {
    console.error('❌ tailwind.config.js not found');
    hasErrors = true;
    return;
  }
  
  try {
    const config = require(tailwindPath);
    if (!config.content || !Array.isArray(config.content)) {
      console.error('❌ Tailwind config missing content array');
      hasErrors = true;
    } else {
      console.log('✅ Tailwind config is valid');
    }
  } catch (error) {
    console.error('❌ Tailwind config has syntax errors:', error.message);
    hasErrors = true;
  }
}

// Check globals.css
function checkGlobalsCSS() {
  console.log('📄 Checking globals.css...');
  const globalsPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
  
  if (!fs.existsSync(globalsPath)) {
    console.error('❌ src/app/globals.css not found');
    hasErrors = true;
    return;
  }
  
  const content = fs.readFileSync(globalsPath, 'utf8');
  const hasTailwindDirectives = content.includes('@tailwind base') && 
                               content.includes('@tailwind components') && 
                               content.includes('@tailwind utilities');
  
  if (!hasTailwindDirectives) {
    console.error('❌ globals.css missing Tailwind directives');
    hasErrors = true;
  } else {
    console.log('✅ globals.css has Tailwind directives');
  }
}

// Check layout.tsx imports
function checkLayoutImports() {
  console.log('📦 Checking layout.tsx imports...');
  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    console.error('❌ src/app/layout.tsx not found');
    hasErrors = true;
    return;
  }
  
  const content = fs.readFileSync(layoutPath, 'utf8');
  const hasGlobalsImport = content.includes("import './globals.css'") || 
                          content.includes("import './globals.css';") ||
                          content.includes('import "./globals.css"') ||
                          content.includes('import "./globals.css";');
  
  if (!hasGlobalsImport) {
    console.error('❌ layout.tsx missing globals.css import');
    hasErrors = true;
  } else {
    console.log('✅ layout.tsx imports globals.css');
  }
}

// Run all checks
checkPostCSSConfig();
checkTailwindConfig();
checkGlobalsCSS();
checkLayoutImports();

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.error('❌ Configuration validation failed!');
  console.log('\n💡 Run "npm run clean-restart" to fix common issues');
  process.exit(1);
} else {
  console.log('✅ All configuration checks passed!');
  console.log('🚀 Your project is ready for development');
} 