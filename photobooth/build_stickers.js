const fs = require('fs');
const path = require('path');

const stickersDir = path.join(__dirname, 'assets', 'stickers');
const outputFile = path.join(__dirname, 'assets', 'stickers', 'stickersData.js');

let stickers = {};

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file)) {
            const relPath = path.relative(stickersDir, fullPath).replace(/\\/g, '/');
            const category = path.dirname(relPath) === '.' ? 'General' : path.dirname(relPath);
            if (!stickers[category]) stickers[category] = [];
            stickers[category].push(`assets/stickers/${relPath}`);
        }
    }
}

scanDir(stickersDir);

const output = `window.STICKERS_DATA = ${JSON.stringify(stickers, null, 2)};`;
fs.writeFileSync(outputFile, output);
console.log('Successfully wrote stickersData.js');
