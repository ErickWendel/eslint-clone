#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import Reporter from './reporter.js';
import SyntaxTreeProcessor from './syntaxTreeProcessor.js';
import chalk from 'chalk';
import * as acorn from 'acorn';

// Check if the file path provided is in the current directory
const isQuokkaEnv = !!process.env.WALLABY_ENV;
function getFileFromCLI() {
  try {
    const { values: { file } } = parseArgs({
      options: {
        file: {
          type: 'string',
          short: 'f',
        },
      },
    });
    if (!file) throw new Error();

    return file;
  } catch (error) {
    console.error(chalk.red('Error: Please provide a file path as an argument.'));
    process.exit(1);
  }
};

const filePath = !isQuokkaEnv ? getFileFromCLI() : './error.js';
const outputFilePath = path.join(process.cwd(), `${path.basename(filePath, '.js')}.linted.js`);


const code = fs.readFileSync(filePath, 'utf-8');
const ast = acorn.parse(code, {
    ecmaVersion: 2022,
    locations: true,
    sourceType: 'module',
    allowHashBang: true,
});
const astHelper = new SyntaxTreeProcessor(filePath);
const errors = astHelper.process(ast);

Reporter.report({
    errors,
    ast,
    outputFilePath,
});