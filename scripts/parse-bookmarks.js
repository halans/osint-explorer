#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseBookmarks(htmlContent) {
  const tools = [];
  const categories = new Map();
  let idCounter = 1;

  // State tracking
  const folderStack = [];
  let inOSINTStack = false;
  let currentDepth = 0;

  // Split by lines and process
  const lines = htmlContent.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track <DL> opening (increases depth)
    if (line.includes('<DL>')) {
      currentDepth++;
    }

    // Track </DL> closing (decreases depth, pop folder)
    if (line.includes('</DL>')) {
      currentDepth--;
      if (folderStack.length > 0 && currentDepth < folderStack[folderStack.length - 1].depth) {
        folderStack.pop();
      }
      // Check if we're leaving OSINT Stack
      if (folderStack.length === 0) {
        inOSINTStack = false;
      }
    }

    // Process H3 folders
    if (line.includes('<H3') && line.includes('</H3>')) {
      const nameMatch = line.match(/<H3[^>]*>([^<]+)<\/H3>/);
      if (nameMatch) {
        const folderName = nameMatch[1];

        // Check if this is OSINT Stack
        if (folderName === 'OSINT Stack') {
          inOSINTStack = true;
          folderStack.length = 0; // Clear stack
          folderStack.push({ name: folderName, depth: currentDepth });
          continue;
        }

        // Only process if we're in OSINT Stack
        if (inOSINTStack) {
          // Remove folders at same or deeper level
          while (folderStack.length > 0 && folderStack[folderStack.length - 1].depth >= currentDepth) {
            folderStack.pop();
          }
          folderStack.push({ name: folderName, depth: currentDepth });
        }
      }
    }

    // Process bookmarks (A tags)
    if (line.includes('<DT><A HREF=') && inOSINTStack) {
      const urlMatch = line.match(/HREF="([^"]+)"/);
      const nameMatch = line.match(/>([^<]+)<\/A>/);
      const iconMatch = line.match(/ICON="([^"]+)"/);

      if (urlMatch && nameMatch) {
        const url = urlMatch[1];
        const name = nameMatch[1];
        const icon = iconMatch ? iconMatch[1] : null;

        // Build path from folder stack (skip OSINT Stack itself)
        const pathArray = folderStack
          .filter(f => f.name !== 'OSINT Stack')
          .map(f => f.name);

        if (pathArray.length === 0) continue; // Skip if no category

        const category = pathArray[0] || 'Uncategorized';
        const subcategory = pathArray[1] || null;
        const subSubcategory = pathArray[2] || null;
        const fullPath = pathArray.join(' › ');

        // Generate tags from name and path
        const tags = [
          ...pathArray.map(p => p.toLowerCase()),
          ...name.toLowerCase().split(/[\s-]+/)
        ].filter(t => t && t.length > 2);

        const tool = {
          id: `tool-${idCounter++}`,
          name: name,
          url: url,
          category: category,
          subcategory: subcategory,
          subSubcategory: subSubcategory,
          path: fullPath,
          tags: [...new Set(tags)], // Remove duplicates
          icon: icon,
          description: null // Can be enriched later
        };

        tools.push(tool);

        // Track category stats
        if (!categories.has(category)) {
          categories.set(category, {
            name: category,
            count: 0,
            subcategories: new Set()
          });
        }
        const catData = categories.get(category);
        catData.count++;
        if (subcategory) {
          catData.subcategories.add(subcategory);
        }
      }
    }
  }

  // Convert category map to array
  const categoryStats = Array.from(categories.values()).map(cat => ({
    name: cat.name,
    count: cat.count,
    subcategories: Array.from(cat.subcategories)
  })).sort((a, b) => b.count - a.count); // Sort by count descending

  return {
    tools,
    categories: categoryStats,
    metadata: {
      totalTools: tools.length,
      totalCategories: categoryStats.length,
      generatedAt: new Date().toISOString(),
      source: 'bookmarks.html'
    }
  };
}

// Main execution
const inputPath = path.join(__dirname, '..', 'bookmarks.html');
const outputPath = path.join(__dirname, '..', 'data', 'tools.json');

console.log('Reading bookmarks file...');
const htmlContent = fs.readFileSync(inputPath, 'utf-8');

console.log('Parsing bookmarks...');
const data = parseBookmarks(htmlContent);

console.log(`\n✓ Found ${data.tools.length} tools across ${data.categories.length} categories`);

// Create data directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Writing JSON output...');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✓ Successfully wrote to ${outputPath}`);
console.log('\nTop categories:');
data.categories.slice(0, 10).forEach(cat => {
  console.log(`  ${cat.name}: ${cat.count} tools`);
});
