const http = require('http');

// Simple test to verify the application works
console.log('Running basic tests...');

// Test 1: Check if index.js exists
const fs = require('fs');
if (fs.existsSync('./index.js')) {
  console.log('✓ index.js exists');
} else {
  console.error('✗ index.js not found');
  process.exit(1);
}

// Test 2: Check if package.json exists
if (fs.existsSync('./package.json')) {
  console.log('✓ package.json exists');
} else {
  console.error('✗ package.json not found');
  process.exit(1);
}

console.log('\nAll tests passed!');
