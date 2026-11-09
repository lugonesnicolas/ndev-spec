#!/usr/bin/env node
import { main } from '../lib/cli.js';

if (Number(process.versions.node.split('.')[0]) < 24) {
  console.error('ndev-spec requiere Node.js 24 o superior.');
  process.exitCode = 1;
} else {
  await main();
}
