/**
 * Script to generate PWA icons from SVG
 * Run with: node scripts/generate-icons.js
 *
 * Prerequisites: npm install sharp
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// SVG template for the Bubbles icon
const generateSvg = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.1875)}" fill="#0284c7"/>
  <circle cx="${size * 0.34375}" cy="${size * 0.40625}" r="${size * 0.1875}" stroke="white" stroke-width="${Math.max(2, size * 0.0625)}" fill="none"/>
  <circle cx="${size * 0.65625}" cy="${size * 0.40625}" r="${size * 0.1875}" stroke="white" stroke-width="${Math.max(2, size * 0.0625)}" fill="none" opacity="0.7"/>
  <circle cx="${size * 0.5}" cy="${size * 0.625}" r="${size * 0.1875}" stroke="white" stroke-width="${Math.max(2, size * 0.0625)}" fill="none" opacity="0.5"/>
</svg>`;

// Check if sharp is available
async function generateWithSharp() {
  try {
    const sharp = (await import('sharp')).default;

    const sizes = [
      { name: 'icon-192x192.png', size: 192 },
      { name: 'icon-512x512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 },
    ];

    const iconsDir = join(__dirname, '../public/icons');

    for (const { name, size } of sizes) {
      const svg = generateSvg(size);
      const buffer = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();

      writeFileSync(join(iconsDir, name), buffer);
      console.log(`Generated ${name}`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Sharp not available. Creating SVG placeholders instead.');
    createSvgPlaceholders();
  }
}

function createSvgPlaceholders() {
  const sizes = [
    { name: 'icon-192x192.svg', size: 192 },
    { name: 'icon-512x512.svg', size: 512 },
    { name: 'apple-touch-icon.svg', size: 180 },
  ];

  const iconsDir = join(__dirname, '../public/icons');

  for (const { name, size } of sizes) {
    const svg = generateSvg(size);
    writeFileSync(join(iconsDir, name), svg);
    console.log(`Generated ${name}`);
  }

  console.log('\nSVG placeholders created. For production, convert to PNG using:');
  console.log('- Online tools like https://cloudconvert.com/svg-to-png');
  console.log('- Or install sharp: pnpm add -D sharp && node scripts/generate-icons.js');
}

generateWithSharp();
