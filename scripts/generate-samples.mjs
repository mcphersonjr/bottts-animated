#!/usr/bin/env node
import { createAvatar } from '../src/createAvatar.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'avatars');
mkdirSync(outDir, { recursive: true });

const samples = [
  { file: 'round-smile01.svg', seed: 'cedric', eyes: 'round', mouth: 'smile01', texture: 'dots', backgroundColor: '448ef4', animationVariant: 'medium' },
  { file: 'bulging-grill01.svg', seed: 'bulging', eyes: 'bulging', mouth: 'grill01', texture: 'camo01', backgroundColor: '15a876', animationVariant: 'medium' },
  { file: 'glow-square01.svg', seed: 'mcpherson', eyes: 'glow', mouth: 'square01', texture: 'circuits', backgroundColor: '9975ea', animationVariant: 'medium' },
  { file: 'roundFrame02-diagram.svg', seed: 'bottts-v3', eyes: 'roundFrame02', mouth: 'diagram', texture: 'grunge01', backgroundColor: '3949ab', animationVariant: 'medium' },
  { file: 'sensor-grill03.svg', seed: 'sensor-bot', eyes: 'sensor', mouth: 'grill03', texture: 'dirty01', backgroundColor: '546e7a', animationVariant: 'medium' },
  { file: 'eva-smile02-camo.svg', seed: 'eva-camo', eyes: 'eva', mouth: 'smile02', texture: 'camo02', backgroundColor: '1499da', animationVariant: 'medium' },
  { file: 'hearts-bite-dots.svg', seed: 'hearts', eyes: 'hearts', mouth: 'bite', texture: 'dots', backgroundColor: 'e25a75', animationVariant: 'medium' },
  { file: 'robocop-grill02-none.svg', seed: 'static-robo', eyes: 'robocop', mouth: 'grill02', texture: null, backgroundColor: '879198', animationVariant: 'none' },
  { file: 'robocop-scan.svg', seed: 'robo-scan', eyes: 'robocop', mouth: 'grill02', texture: null, backgroundColor: '879198', animationVariant: 'medium' },
];

for (const s of samples) {
  const { file, ...opts } = s;
  writeFileSync(join(outDir, file), createAvatar(opts));
  console.log('wrote', file);
}
