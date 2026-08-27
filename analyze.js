const fs = require('fs');

const content = fs.readFileSync('.next/analyze/client.html', 'utf8');
const match = content.match(/window\.chartData = (\[.*?\]);/s);
if (match) {
  const data = JSON.parse(match[1]);
  const chunks = [];
  
  function traverse(node, path) {
    if (node.groups) {
      node.groups.forEach(g => traverse(g, path + '/' + node.label));
    } else {
      chunks.push({ name: path + '/' + node.label, size: node.statSize });
    }
  }
  
  data.forEach(d => traverse(d, d.label));
  chunks.sort((a, b) => b.size - a.size);
  
  console.log("Top 10 largest modules:");
  chunks.slice(0, 10).forEach(c => {
    console.log(`${(c.size / 1024).toFixed(2)} KB - ${c.name}`);
  });
} else {
  console.log("Could not find chartData");
}
