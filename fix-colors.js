const fs = require('fs');
const path = require('path');

const dir1 = './src/components';
const dir2 = './src/app';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = [...walk(dir1), ...walk(dir2)];

const replacements = {
  'text-white/10': 'text-zinc-500',
  'text-white/15': 'text-zinc-500',
  'text-white/20': 'text-zinc-400',
  'text-white/25': 'text-zinc-400',
  'text-white/30': 'text-zinc-400',
  'text-white/35': 'text-zinc-300',
  'text-white/40': 'text-zinc-300',
  'text-white/45': 'text-zinc-300',
  'text-white/50': 'text-zinc-300',
  'text-white/60': 'text-zinc-200',
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

console.log('Done!');
