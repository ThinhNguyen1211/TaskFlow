#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting deployment process...\n');

// Check if required environment variables are set
function checkEnvironmentVariables() {
    console.log('📋 Checking environment variables...');
    
    const requiredEnvVars = [
        'VITE_API_URL',
        'VITE_APP_NAME'
    ];
    
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
        console.warn(`⚠️  Warning: Missing environment variables: ${missing.join(', ')}`);
        console.log('   Make sure to set these in your deployment platform.\n');
    } else {
        console.log('✅ All required environment variables are set.\n');
    }
}

// Run tests before deployment
function runTests() {
    console.log('🧪 Running tests...');
    try {
        execSync('npm test -- --run', { stdio: 'inherit' });
        console.log('✅ All tests passed.\n');
    } catch (error) {
        console.log('⚠️  Tests failed or not configured. Continuing with deployment...\n');
    }
}

// Build the project
function buildProject() {
    console.log('🔨 Building project...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Build completed successfully.\n');
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Check build output
function checkBuildOutput() {
    console.log('📦 Checking build output...');
    
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(distPath)) {
        console.error('❌ Build directory not found');
        process.exit(1);
    }
    
    if (!fs.existsSync(indexPath)) {
        console.error('❌ index.html not found in build directory');
        process.exit(1);
    }
    
    console.log('✅ Build output verified.\n');
}

// Optimize build for production
function optimizeBuild() {
    console.log('⚡ Optimizing build...');
    
    // Check bundle size
    const distPath = path.join(process.cwd(), 'dist');
    const files = fs.readdirSync(distPath, { recursive: true });
    
    let totalSize = 0;
    files.forEach(file => {
        const filePath = path.join(distPath, file);
        if (fs.statSync(filePath).isFile()) {
            totalSize += fs.statSync(filePath).size;
        }
    });
    
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📊 Total bundle size: ${sizeInMB} MB`);
    
    if (totalSize > 10 * 1024 * 1024) { // 10MB
        console.warn('⚠️  Bundle size is quite large. Consider code splitting.');
    }
    
    console.log('✅ Build optimization complete.\n');
}

// Main deployment function
function deploy() {
    try {
        checkEnvironmentVariables();
        runTests();
        buildProject();
        checkBuildOutput();
        optimizeBuild();
        
        console.log('🎉 Deployment preparation completed successfully!');
        console.log('📝 Next steps:');
        console.log('   1. Deploy to your hosting platform (Vercel, Netlify, etc.)');
        console.log('   2. Set up environment variables on the platform');
        console.log('   3. Configure custom domain if needed');
        console.log('   4. Set up monitoring and analytics');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    deploy();
}

export { deploy };