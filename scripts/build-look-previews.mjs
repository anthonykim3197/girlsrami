import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import vm from 'node:vm';

const run = promisify(execFile);
const ownSite = 'https://girlslami.com';
const assetFolder = 'assets/detail/look-previews';
const allowRemote = process.argv.includes('--allow-remote');
const siteArgument = process.argv.slice(2).find(arg => arg !== '--allow-remote');
const site = resolve(siteArgument || fileURLToPath(new URL('../', import.meta.url)));
const scratch = await mkdtemp(join(tmpdir(), 'girlslami-look-previews-'));
const sourceCache = new Map();
const failures = [];

async function dimensions(file) {
  const { stdout } = await run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]);
  const width = Number(stdout.match(/pixelWidth: (\d+)/)?.[1]);
  const height = Number(stdout.match(/pixelHeight: (\d+)/)?.[1]);
  if (!(width > 0 && height > 0)) throw new Error('Cannot read image dimensions');
  return { width, height };
}

async function variant(input, original, key, width, quality) {
  const output = join(scratch, `${key}-${width}.webp`);
  await run('cwebp', [
    '-quiet', '-q', String(quality), '-metadata', 'icc',
    '-resize', String(Math.min(original.width, width)), '0', input, '-o', output,
  ]);
  const bytes = await readFile(output);
  if (bytes.length >= original.bytes) return null;
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 24);
  const path = `${assetFolder}/${hash}.webp`;
  await writeFile(join(site, path), bytes, { flag: 'wx' }).catch(error => {
    if (error.code !== 'EEXIST') throw error;
  });
  return { path, bytes: bytes.length, ...await dimensions(output) };
}

async function encode(url, index) {
  const key = String(index);
  let input;
  if (url.origin === ownSite) {
    input = join(site, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
  } else {
    if (!allowRemote || url.protocol !== 'https:' || url.username || url.password) {
      throw new Error('Remote image disabled');
    }
    input = join(scratch, `${key}-source.webp`);
    await run('curl', ['--fail', '--silent', '--show-error', '--max-time', '15', '--output', input, url.href]);
  }
  const original = { bytes: (await stat(input)).size, ...await dimensions(input) };
  const display = await variant(input, original, key, 960, 84);
  const thumb = await variant(input, original, key, 420, 82);
  return { original, display, thumb };
}

try {
  const context = { window: {} };
  vm.runInNewContext(await readFile(join(site, 'detail-catalog.js'), 'utf8'), context, { timeout: 1000 });
  const details = Object.values(context.window.GR_DETAIL);
  const sources = [...new Set(details.flatMap(detail => [
    ...(detail.looks || []).flatMap(look => Object.values(look.images || {})),
    detail.thumbnail,
  ]).filter(source => typeof source === 'string' && source))].sort();
  if (sources.length === 0) throw new Error('No look images found');
  await mkdir(join(site, assetFolder), { recursive: true });

  const results = new Array(sources.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(8, sources.length) }, async () => {
    for (let index = cursor++; index < sources.length; index = cursor++) {
      const source = sources[index];
      try {
        const url = new URL(source, ownSite);
        if (!sourceCache.has(url.href)) sourceCache.set(url.href, encode(url, index));
        results[index] = await sourceCache.get(url.href);
      } catch (error) {
        failures.push({ source, reason: error.message.split('\n')[0] });
      }
    }
  });
  await Promise.all(workers);

  const manifest = {};
  const totals = { original: 0, display: 0, thumb: 0, displayFiles: 0, thumbFiles: 0 };
  const files = new Set();
  for (const [index, result] of results.entries()) {
    if (!result) continue;
    const source = sources[index];
    const { original, display, thumb } = result;
    manifest[source] = {
      display: display?.path || source,
      thumb: thumb?.path || source,
      width: (display || original).width,
      height: (display || original).height,
    };
    totals.original += original.bytes;
    totals.display += (display || original).bytes;
    totals.thumb += (thumb || original).bytes;
    totals.displayFiles += Number(Boolean(display));
    totals.thumbFiles += Number(Boolean(thumb));
    if (display) files.add(display.path);
    if (thumb) files.add(thumb.path);
  }

  const manifestPath = join(site, 'look-previews.js');
  const temporaryManifest = join(dirname(manifestPath), `.look-previews-${process.pid}.js`);
  await writeFile(temporaryManifest, `window.GR_LOOK_PREVIEWS = ${JSON.stringify(manifest)};\n`);
  await rename(temporaryManifest, manifestPath);
  console.log(JSON.stringify({
    site, products: details.length, sources: sources.length, mapped: Object.keys(manifest).length,
    uniqueDerivatives: files.size, bytes: totals, failures,
  }, null, 2));
} finally {
  await rm(scratch, { recursive: true, force: true });
}
