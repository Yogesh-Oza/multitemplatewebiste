/**
 * Test cases for subdomain detection
 * This file helps verify the detection logic works correctly
 */

import { detectSubdomain, shouldShowHeaderFooter } from './subdomain-detection';

// Test cases
const testCases = [
  {
    hostname: 'localhost',
    pathname: '/',
    expected: { isMainDomain: true, isSubdomain: false, shouldShowHeaderFooter: false },
    description: 'Localhost main domain - should NOT show header/footer'
  },
  {
    hostname: 'mahagp.in',
    pathname: '/',
    expected: { isMainDomain: true, isSubdomain: false, shouldShowHeaderFooter: false },
    description: 'Production main domain - should NOT show header/footer'
  },
  {
    hostname: 'pune.localhost',
    pathname: '/',
    expected: { isMainDomain: false, isSubdomain: true, shouldShowHeaderFooter: true },
    description: 'Localhost subdomain - should show header/footer'
  },
  {
    hostname: 'pune.mahagp.in',
    pathname: '/',
    expected: { isMainDomain: false, isSubdomain: true, shouldShowHeaderFooter: true },
    description: 'Production subdomain - should show header/footer'
  },
  {
    hostname: 'localhost',
    pathname: '/admin',
    expected: { isMainDomain: true, isSubdomain: false, shouldShowHeaderFooter: false },
    description: 'Admin route - should NOT show header/footer'
  }
];

// Run tests (only in development)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Running subdomain detection tests...');
  
  testCases.forEach((testCase, index) => {
    const result = detectSubdomain(testCase.hostname);
    const shouldShow = shouldShowHeaderFooter(testCase.pathname, testCase.hostname);
    
    const passed = 
      result.isMainDomain === testCase.expected.isMainDomain &&
      result.isSubdomain === testCase.expected.isSubdomain &&
      shouldShow === testCase.expected.shouldShowHeaderFooter;
    
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`  Hostname: ${testCase.hostname}`);
    console.log(`  Pathname: ${testCase.pathname}`);
    console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
    console.log(`  Actual: { isMainDomain: ${result.isMainDomain}, isSubdomain: ${result.isSubdomain}, shouldShowHeaderFooter: ${shouldShow} }`);
    console.log(`  Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log('---');
  });
}
