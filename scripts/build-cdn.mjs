#!/usr/bin/env node
/**
 * Browser bundles for jsDelivr and unpkg.
 * dist/bottts-animated.js      ESM, one file, named exports
 * dist/bottts-animated.min.js  minified IIFE, global BotttsAnimated
 */
import { buildSync } from 'esbuild';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const entry = join(root, 'src/createAvatar.js');
mkdirSync(dist, { recursive: true });

const banner = {
  js: '/*! Bottts-Neutral Animated 6.2.1 | Animation © McPherson Media, LLC | Bottts art by Pablo Stanley (bottts.com) — free for personal and commercial use */',
};

const shared = {
  entryPoints: [entry],
  bundle: true,
  platform: 'browser',
  target: ['es2020'],
  sourcemap: true,
  legalComments: 'none',
  banner,
};

buildSync({
  ...shared,
  format: 'esm',
  outfile: join(dist, 'bottts-animated.js'),
});

buildSync({
  ...shared,
  format: 'iife',
  globalName: 'BotttsAnimated',
  minify: true,
  outfile: join(dist, 'bottts-animated.min.js'),
});

console.log('wrote dist/bottts-animated.js');
console.log('wrote dist/bottts-animated.min.js');
