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
  
  let parts = content.split('`');
  for (let i = 0; i < parts.length; i++) {
     if (i % 2 === 0) {
        // Outside backticks: safe to replace all $ with ₹
        parts[i] = parts[i].replace(/\$/g, '₹');
     } else {
        // Inside backticks: replace $ with ₹ UNLESS it is followed by { (template interpolation)
        parts[i] = parts[i].replace(/\$(?!\{)/g, '₹');
     }
  }
  let newContent = parts.join('`');

  if (newContent !== content) {
    fs.writeFileSync(f, newContent);
    changedFiles.push(f);
  }
});

console.log("Updated files:", changedFiles.join(", "));
