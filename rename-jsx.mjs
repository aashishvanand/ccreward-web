import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.js') && !filePath.includes('api.js') && !filePath.includes('analytics.js') && !filePath.includes('firebaseUtils.js')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const isJsx = content.includes('from "react"') || content.includes("from 'react'") || content.match(/<\/[a-zA-Z0-9_]+>/) || content.match(/<[a-zA-Z0-9_]+[^>]*\/>/) || content.match(/<[A-Z][a-zA-Z0-9_]*[^>]*>/);
    
    if (isJsx) {
      console.log('Renaming', filePath);
      fs.renameSync(filePath, filePath + 'x');
    }
  }
});
