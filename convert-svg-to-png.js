const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const svgFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('og-') && f.endsWith('.svg'));

console.log(`Found ${svgFiles.length} SVG files to convert`);

svgFiles.forEach(async (svgFile) => {
  const svgPath = path.join(publicDir, svgFile);
  const pngFile = svgFile.replace('.svg', '.png');
  const pngPath = path.join(publicDir, pngFile);
  
  try {
    await sharp(svgPath)
      .resize(1200, 630)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(pngPath);
    console.log(`✅ Converted: ${svgFile} → ${pngFile}`);
  } catch (err) {
    console.error(`❌ Failed: ${svgFile}`, err.message);
  }
});

console.log('Conversion complete!');