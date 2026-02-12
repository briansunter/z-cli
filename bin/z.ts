#!/usr/bin/env bun
import { createProgram } from '../src/cli/index';

const program = createProgram();
program.parseAsync(process.argv).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
