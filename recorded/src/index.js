#!/usr/bin/env node

import { parseArgs } from 'node:util'
import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import * as espree from 'espree'
import Reporter from './reporter.js'
import SyntaxTreeProcessor from './syntaxTreeProcessor.js'

function getFilePathFromCLI() {
    try {

        const { values: { file } } = parseArgs({
            options: {
                file: {
                    type: 'string',
                    alias: 'f',
                }
            }
        })
        if (!file) throw new Error();

        return file

    } catch (error) {
        console.error(chalk.red('Error: Please provide a valid file path as an argument using -f or --file'))
        process.exit(1)
    }
}

const filePath = getFilePathFromCLI()
const outputFilePath = path.join(process.cwd(), `${path.basename(filePath, '.js')}.linted.js`)
const code = fs.readFileSync(filePath, 'utf-8')
const ast = espree.parse(code, {
    ecmaVersion: 2022,
    loc: true,
    sourceType: 'module',
})
const syntaxTreeProcessor = new SyntaxTreeProcessor(filePath)
const errors = syntaxTreeProcessor.process(ast)
Reporter.report({
    // errors: [{
    //     message: 'Missing semicolon',
    //     errorLocation: filePath + ':1:3'
    // }],
    errors,
    ast,
    outputFilePath,
})