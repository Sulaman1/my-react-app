const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src");

// Recursively scan all project files
function scanFiles(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanFiles(fullPath, fileList);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Extract imports (images + JS modules)
function extractImports(files) {
  const importRegex = /['"](\.\/.*?\.(png|jpg|jpeg|gif|svg|js|jsx))['"]/g;
  const imports = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = importRegex.exec(content))) {
      imports.add(match[1]);
    }
  });

  return [...imports];
}

// Create placeholder files
function createPlaceholders(importPaths) {
  importPaths.forEach(relPath => {
    const absPath = path.join(SRC_DIR, relPath.replace("./", ""));
    const dir = path.dirname(absPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(absPath)) {
      if (/\.(png|jpg|jpeg|gif|svg)$/.test(absPath)) {
        fs.writeFileSync(absPath, ""); // empty image file
        console.log("🖼️ Created image placeholder:", absPath);
      } else if (/\.(js|jsx)$/.test(absPath)) {
        fs.writeFileSync(absPath, "export default function Placeholder(){ return null };"); 
        console.log("📄 Created JS placeholder:", absPath);
      }
    }
  });
}

// Run
console.log("🔍 Scanning project...");
const files = scanFiles(SRC_DIR);
const imports = extractImports(files);
createPlaceholders(imports);

console.log("✅ All missing images & JS modules replaced with placeholders!");
