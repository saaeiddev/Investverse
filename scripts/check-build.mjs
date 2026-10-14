import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const html=await readFile(path.join(root,'index.html'),'utf8');
assert(html.includes('<title>INVESTVERSE'),'Production title missing');
const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
for(const ref of refs){
  if(ref.startsWith('http'))continue;
  assert(ref.startsWith('/Investverse/'),`Incorrect GitHub Pages base path: ${ref}`);
  const file=path.join(root,ref.slice('/Investverse/'.length));await stat(file);
}
const files=await readdir(path.join(root,'assets'));
assert(files.some(f=>f.startsWith('WorldScene-')),'Lazy 3D bundle missing');
assert(files.some(f=>f.startsWith('vazirmatn-arabic-')),'Persian font missing');
for(const file of files.filter(f=>f.endsWith('.css'))){
  const css=await readFile(path.join(root,'assets',file),'utf8');
  for(const match of css.matchAll(/url\((?:["']?)([^)"']+)/g)){
    if(match[1].startsWith('data:'))continue;
    const relative=match[1].startsWith('/Investverse/')?match[1].slice('/Investverse/'.length):`assets/${match[1]}`;
    await stat(path.join(root,relative));
  }
}
await stat(path.join(root,'.nojekyll'));
console.log(`Production paths verified: ${refs.length} entry references, ${files.length} bundled files, Persian font, lazy 3D chunk, .nojekyll.`);
