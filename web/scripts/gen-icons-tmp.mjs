import { writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const generateSvg = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.1875)}" fill="#0284c7"/>
  <circle cx="${size * 0.34375}" cy="${size * 0.40625}" r="${size * 0.1875}" stroke="white" stroke-width="${Math.max(2, size * 0.0625)}" fill="none"/>
  <circle cx="${size * 0.65625}" cy="${size * 0.40625}" r="${size * 0.1875}" stroke="white" stroke-width="${Math.max(2, size * 0.0625)}" fill="none" opacity="0.7"/>
  <circle cx="${size * 0.5}" cy="${size * 0.625}" r="${size * 0.1875}" stroke="white" stroke-width="${Math.max(2, size * 0.0625)}" fill="none" opacity="0.5"/>
</svg>`;

const sizes = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

const iconsDir = '/Users/urjit/code/bubbles/web/public/icons';

for (const { name, size } of sizes) {
  const svg = generateSvg(size);
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(iconsDir, name), buffer);
  console.log('Generated', name);
}
console.log('Done!');
