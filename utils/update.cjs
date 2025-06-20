const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, 'books');
const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(booksDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Match frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return; // skip if no frontmatter

  let frontmatter = match[1];

  // Remove any line that starts with 'links:'
  frontmatter = frontmatter
    .split('\n')
    .filter(line => !/^links:/.test(line.trim()))
    .join('\n');

  const newContent = content.replace(
    /^---\n([\s\S]*?)\n---/,
    `---\n${frontmatter}\n---`
  );

  fs.writeFileSync(filePath, newContent, 'utf8');
});

console.log("Removed 'links:' from frontmatter in books/*.md");