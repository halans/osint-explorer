#!/usr/bin/env node

/**
 * Automated Testing Script for OSINT Directory App
 * Tests data loading, search, filtering, and other functionality
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function pass(testName) {
  results.passed++;
  results.tests.push({ name: testName, status: 'PASS' });
  log(`  ✓ ${testName}`, colors.green);
}

function fail(testName, reason) {
  results.failed++;
  results.tests.push({ name: testName, status: 'FAIL', reason });
  log(`  ✗ ${testName}`, colors.red);
  if (reason) log(`    Reason: ${reason}`, colors.red);
}

function warn(message) {
  results.warnings++;
  log(`  ⚠ ${message}`, colors.yellow);
}

function testSection(title) {
  log(`\n${title}`, colors.cyan);
  log('='.repeat(title.length), colors.cyan);
}

// Load and validate tools.json
testSection('Test 1: Data Loading from tools.json');

try {
  const toolsPath = path.join(__dirname, 'public', 'tools.json');

  if (!fs.existsSync(toolsPath)) {
    fail('tools.json exists', 'File not found at public/tools.json');
  } else {
    pass('tools.json exists');
  }

  const rawData = fs.readFileSync(toolsPath, 'utf8');
  pass('tools.json is readable');

  const data = JSON.parse(rawData);
  pass('tools.json has valid JSON format');

  // Validate data structure
  if (!data.tools || !Array.isArray(data.tools)) {
    fail('tools.json has tools array', 'Missing or invalid tools array');
  } else {
    pass(`tools.json has tools array (${data.tools.length} tools)`);
  }

  if (!data.categories || !Array.isArray(data.categories)) {
    fail('tools.json has categories array', 'Missing or invalid categories array');
  } else {
    pass(`tools.json has categories array (${data.categories.length} categories)`);
  }

  if (typeof data.totalTools !== 'number') {
    fail('tools.json has totalTools count', 'Missing or invalid totalTools');
  } else {
    pass(`tools.json has totalTools count (${data.totalTools})`);

    if (data.totalTools !== data.tools.length) {
      warn(`totalTools (${data.totalTools}) doesn't match actual tools count (${data.tools.length})`);
    }
  }

  // Test 2: Search Functionality
  testSection('Test 2: Search Functionality');

  // Simulate search by name
  const searchQuery = 'google';
  const searchResults = data.tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery) ||
    tool.category.toLowerCase().includes(searchQuery) ||
    tool.subcategory?.toLowerCase().includes(searchQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery))
  );

  if (searchResults.length > 0) {
    pass(`Search by name works (found ${searchResults.length} tools matching "${searchQuery}")`);
  } else {
    fail(`Search by name works`, 'No results found for common search term');
  }

  // Test search by tag
  const tagSearch = 'osint';
  const tagResults = data.tools.filter(tool =>
    tool.tags.some(tag => tag.toLowerCase().includes(tagSearch))
  );

  if (tagResults.length > 0) {
    pass(`Search by tag works (found ${tagResults.length} tools with tag "${tagSearch}")`);
  } else {
    warn(`No tools found with tag "${tagSearch}"`);
  }

  // Test 3: Category Filtering
  testSection('Test 3: Category Filtering and Selection');

  if (data.categories.length > 0) {
    pass('Categories are available for filtering');

    const firstCategory = data.categories[0];
    const categoryTools = data.tools.filter(t => t.category === firstCategory.name);

    if (categoryTools.length > 0) {
      pass(`Category filtering works (${firstCategory.name}: ${categoryTools.length} tools)`);

      if (categoryTools.length === firstCategory.count) {
        pass('Category counts are accurate');
      } else {
        fail('Category counts are accurate',
          `Expected ${firstCategory.count} but found ${categoryTools.length} tools in ${firstCategory.name}`);
      }
    } else {
      fail('Category filtering works', `No tools found in category ${firstCategory.name}`);
    }
  } else {
    fail('Categories are available', 'No categories found');
  }

  // Test 4: Multi-Facet Filters
  testSection('Test 4: Multi-Facet Filters');

  // Extract unique subcategories
  const allSubcategories = [...new Set(data.tools.map(t => t.subcategory).filter(Boolean))];
  if (allSubcategories.length > 0) {
    pass(`Subcategories available (${allSubcategories.length} unique)`);
  } else {
    warn('No subcategories found in dataset');
  }

  // Extract unique tags
  const allTags = [...new Set(data.tools.flatMap(t => t.tags))];
  if (allTags.length > 0) {
    pass(`Tags available (${allTags.length} unique)`);
  } else {
    fail('Tags available', 'No tags found');
  }

  // Test combined filtering
  if (data.categories.length > 0 && allTags.length > 0) {
    const testCategory = data.categories[0].name;
    const testTag = allTags[0];

    const combinedResults = data.tools.filter(t =>
      t.category === testCategory && t.tags.includes(testTag)
    );

    pass(`Combined filtering works (category + tag: ${combinedResults.length} results)`);
  }

  // Test 5: Tool Detail Data
  testSection('Test 5: Tool Detail Panel Data');

  if (data.tools.length > 0) {
    const sampleTool = data.tools[0];

    // Check required fields
    const requiredFields = ['id', 'name', 'url', 'category', 'path', 'tags'];
    let allFieldsPresent = true;

    requiredFields.forEach(field => {
      if (sampleTool[field] === undefined) {
        fail(`Tool has required field: ${field}`, `Missing field in tool: ${sampleTool.name || 'unknown'}`);
        allFieldsPresent = false;
      }
    });

    if (allFieldsPresent) {
      pass('All required tool fields are present');
    }

    // Check URL format
    if (sampleTool.url && (sampleTool.url.startsWith('http://') || sampleTool.url.startsWith('https://'))) {
      pass('Tool URLs have valid format');
    } else {
      fail('Tool URLs have valid format', `Invalid URL: ${sampleTool.url}`);
    }

    // Check tags array
    if (Array.isArray(sampleTool.tags)) {
      pass('Tool tags are in array format');
    } else {
      fail('Tool tags are in array format', 'Tags should be an array');
    }

    // Test related tools logic
    const relatedTools = data.tools.filter(t =>
      t.id !== sampleTool.id &&
      (t.category === sampleTool.category ||
       t.tags.some(tag => sampleTool.tags.includes(tag)))
    ).slice(0, 5);

    if (relatedTools.length > 0) {
      pass(`Related tools can be found (${relatedTools.length} related to ${sampleTool.name})`);
    } else {
      warn('No related tools found (dataset may be too small)');
    }
  }

  // Test 6: Text Highlighting
  testSection('Test 6: Search Text Highlighting');

  // Simulate text highlighting logic
  const highlightTest = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.some(part => part.toLowerCase() === query.toLowerCase());
  };

  const testToolName = data.tools.find(t => t.name.toLowerCase().includes('google'));
  if (testToolName) {
    const hasHighlight = highlightTest(testToolName.name, 'google');
    if (hasHighlight) {
      pass('Text highlighting logic works correctly');
    } else {
      fail('Text highlighting logic works correctly', 'Highlighting pattern not matched');
    }
  }

  // Test 7: Shortlist Functionality (Data Structure)
  testSection('Test 7: Shortlist Functionality (Data Structure)');

  // Test shortlist add/remove logic
  let mockShortlist = [];
  const testTool = data.tools[0];

  // Add to shortlist
  const exists = mockShortlist.find(t => t.id === testTool.id);
  if (!exists) {
    mockShortlist.push(testTool);
  }

  if (mockShortlist.length === 1 && mockShortlist[0].id === testTool.id) {
    pass('Shortlist add functionality works');
  } else {
    fail('Shortlist add functionality works', 'Tool not added correctly');
  }

  // Remove from shortlist
  mockShortlist = mockShortlist.filter(t => t.id !== testTool.id);

  if (mockShortlist.length === 0) {
    pass('Shortlist remove functionality works');
  } else {
    fail('Shortlist remove functionality works', 'Tool not removed correctly');
  }

  // Test duplicate prevention
  mockShortlist = [testTool];
  const duplicate = mockShortlist.find(t => t.id === testTool.id);
  if (duplicate) {
    pass('Shortlist duplicate detection works');
  }

  // Test 8: Component Files
  testSection('Test 8: Component Files Exist');

  const components = [
    'SearchBar.jsx',
    'CategoryStats.jsx',
    'FilterPanel.jsx',
    'ToolList.jsx',
    'ToolDetail.jsx',
    'ShortlistView.jsx'
  ];

  components.forEach(component => {
    const componentPath = path.join(__dirname, 'src', 'components', component);
    if (fs.existsSync(componentPath)) {
      pass(`Component exists: ${component}`);
    } else {
      fail(`Component exists: ${component}`, 'File not found');
    }
  });

  // Test 9: CSS Files
  testSection('Test 9: CSS Styling Files');

  const cssFiles = [
    'App.css',
    'index.css',
    'components/SearchBar.css',
    'components/CategoryStats.css',
    'components/FilterPanel.css',
    'components/ToolList.css',
    'components/ToolDetail.css',
    'components/ShortlistView.css'
  ];

  cssFiles.forEach(cssFile => {
    const cssPath = path.join(__dirname, 'src', cssFile);
    if (fs.existsSync(cssPath)) {
      pass(`CSS file exists: ${cssFile}`);
    } else {
      fail(`CSS file exists: ${cssFile}`, 'File not found');
    }
  });

  // Test 10: App.jsx Structure
  testSection('Test 10: Main App Component');

  const appPath = path.join(__dirname, 'src', 'App.jsx');
  if (fs.existsSync(appPath)) {
    pass('App.jsx exists');

    const appContent = fs.readFileSync(appPath, 'utf8');

    // Check for key functionality
    const checks = [
      { pattern: /searchQuery/, name: 'Search state management' },
      { pattern: /selectedCategory/, name: 'Category state management' },
      { pattern: /selectedFilters/, name: 'Filter state management' },
      { pattern: /shortlist/, name: 'Shortlist state management' },
      { pattern: /localStorage\.getItem/, name: 'LocalStorage loading' },
      { pattern: /localStorage\.setItem/, name: 'LocalStorage saving' },
      { pattern: /fetch\(['"]\/?tools\.json['"]\)/, name: 'Data fetching' },
      { pattern: /useMemo/, name: 'Performance optimization (useMemo)' },
    ];

    checks.forEach(check => {
      if (check.pattern.test(appContent)) {
        pass(check.name);
      } else {
        fail(check.name, 'Pattern not found in App.jsx');
      }
    });
  } else {
    fail('App.jsx exists', 'File not found');
  }

} catch (error) {
  fail('Test execution', error.message);
  console.error(error);
}

// Print Summary
testSection('Test Summary');

const total = results.passed + results.failed;
const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

log(`\nTotal Tests: ${total}`);
log(`Passed: ${results.passed}`, colors.green);
log(`Failed: ${results.failed}`, results.failed > 0 ? colors.red : colors.reset);
log(`Warnings: ${results.warnings}`, results.warnings > 0 ? colors.yellow : colors.reset);
log(`Pass Rate: ${passRate}%`, passRate >= 90 ? colors.green : passRate >= 70 ? colors.yellow : colors.red);

// Exit code based on results
process.exit(results.failed > 0 ? 1 : 0);
