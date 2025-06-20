const fs = require('fs');
const path = require('path');

// Load your books.json (or .md) file
const books = require('./books.json'); // or require('./books.md') if you rename it to .json

const outputDir = path.join(__dirname, 'books');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

books.forEach(book => {
  // Create a safe filename
  const safeTitle = book.title
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
    .slice(0, 60);

  const md = `---
title: "${book.title.replace(/"/g, '\\"')}"
authors: ${JSON.stringify(book.authors)}
date: "${book.date}"
---

<!-- Your comments or review here -->
`;

  fs.writeFileSync(path.join(outputDir, `${safeTitle}.md`), md);
});

console.log('Markdown files created in ./books');