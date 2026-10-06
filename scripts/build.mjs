import {mkdir,copyFile,readdir,rm,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const out=new URL('../dist/',import.meta.url);
await rm(out,{recursive:true,force:true}); await mkdir(out,{recursive:true});
for(const name of await readdir(new URL('../',import.meta.url))) {
  if(['story-machine.jpg','story-yarn.jpg','story-hands.jpg'].includes(name)) continue;
  if(/\.(html|css|jpg|png|js)$/.test(name) || ['config.json','_headers','_redirects'].includes(name)) await copyFile(new URL('../'+name,import.meta.url),new URL(name,out));
}
// Version dynamically imported admin modules from the leaves upward.
for (const [name, dependency] of [['admin-product-editor.js','admin-inventory.js'],['member.js','admin-product-editor.js']]) {
  const depHash = createHash('sha256').update(await readFile(new URL(dependency,out))).digest('hex').slice(0,12);
  const path = new URL(name,out);
  const source = await readFile(path,'utf8');
  await writeFile(path,source.replaceAll(`'./${dependency}'`,`'./${dependency}?v=${depHash}'`));
}
const versions = new Map();
for (const name of await readdir(out)) {
  if (/\.(js|css)$/.test(name)) versions.set(name, createHash('sha256').update(await readFile(new URL(name,out))).digest('hex').slice(0,12));
}
for (const name of await readdir(out)) {
  if (!name.endsWith('.html')) continue;
  const path = new URL(name,out);
  const html = await readFile(path,'utf8');
  await writeFile(path,html.replace(/(src|href)="([^"?]+\.(?:js|css))(?:\?v=[a-f0-9]+)?"/g,(match,attribute,asset)=>versions.has(asset)?`${attribute}="${asset}?v=${versions.get(asset)}"`:match));
}
console.log('Static storefront built; private backend and GPU code excluded.');
