const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedFiles = [];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Match $ that is not followed by { (to avoid breaking ${...})
  // Also avoid breaking literal "$" in code if any, but since it's an Indian app context, 
  // replacing $ with ₹ for currency display is wanted.
  if (content.match(/\$(?!\{)/)) {
    // Let's replace ONLY $ signs that are followed by a digit or are literal "$".
    // Alternatively, just replace $ not followed by {
    let replaced = content.replace(/\$(?!\{)/g, '₹');
    if (replaced !== content) {
      fs.writeFileSync(f, replaced);
      changedFiles.push(f);
    }
  }
});

console.log("Updated files:", changedFiles.join(", "));
