import {mkdir,copyFile,readdir,rm} from 'node:fs/promises';
const out=new URL('../dist/',import.meta.url);
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of await readdir(new URL('../',import.meta.url))) {
  if(/\.(html|css|jpg|png|js)$/.test(name) || ['config.json','_headers','_redirects'].includes(name)) await copyFile(new URL('../'+name,import.meta.url),new URL(name,out));
}
console.log('Public storefront release assembled.');
