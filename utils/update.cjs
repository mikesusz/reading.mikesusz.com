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

  // This is the code block to remove something from frontmatter
  // frontmatter = frontmatter
  //   .split('\n')
  //   .filter(line => !/^links:/.test(line.trim()))
  //   .join('\n');

  // const newContent = content.replace(
  //   /^---\n([\s\S]*?)\n---/,
  //   `---\n${frontmatter}\n---`
	// );

	// This is the code block to add something to frontmatter
  if (!/^read:/m.test(frontmatter)) {
    frontmatter += '\nread: true';
  }

  const newContent = content.replace(
    /^---\n([\s\S]*?)\n---/,
    `---\n${frontmatter}\n---`
  );

  fs.writeFileSync(filePath, newContent, 'utf8');
});

console.log("Frontmatter updated");