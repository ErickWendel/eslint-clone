#!/usr/bin/env node

import fs from 'node:fs';
import * as acorn from 'acorn';
import chalk from 'chalk';
import * as astring from 'astring';
import ASTHelper from './astHelper.js';
import { parseArgs } from 'node:util';

class ESLintClone {
    #errors = [];
    #filePath = '';
    #outputFile = '';
    #variables = new Map();
    #messages = {
        singleQuotes: () => 'use single quotes instead of double quotes',
        useConst: (variableType) => `use "const" instead of ${variableType}`,
        useLet: (variableType) => `use "let" instead of ${variableType}`,
    }
    #stages = {
        declaration: 'declaration',
        expressionDeclaration: 'expressionDeclaration',
    }
    #variableTypes = {
        var: 'var',
        let: 'let',
        const: 'const',
    }
    constructor(filePath) {
        this.#filePath = filePath;
        this.#outputFile = filePath.replace('.js', '').concat('.linted.js');
    }

    #reportError(message, { line, column }) {
        const errorLocation = `${this.#filePath}:${line}:${column + 1}`;
        const errorMessage = `${chalk.red('Error:')} ${message}`;
        const finalMessage = `${errorMessage}\n${chalk.gray(errorLocation)}\n`
        this.#errors.push({
            message: finalMessage,
            errorLocation
        });
    }
    #notifyErrors() {
        this.#errors
            // sort by line number and column
            .sort((a, b) => {
                const [aLine, aColumn] = a.errorLocation.split(':').slice(1);
                const [bLine, bColumn] = b.errorLocation.split(':').slice(1);
                if (aLine === bLine) {
                    return aColumn - bColumn;
                }
                return aLine - bLine;
            })
            .forEach(({ message }) => console.error(message));
    }

    #handleLiteral(node) {
        if (!(node.raw && typeof node.value === 'string')) {
            return;
        }
        const position = node.loc.start;
        if (!node.raw.includes(`"`)) {
            return;
        }

        this.#reportError(this.#messages.singleQuotes(), position);
    }

    #handleExpressionDeclaration(node) {
        const { expression } = node;

        // console.log
        if (!expression.left) return;

        if (!expression.left.type === 'Identifier') {
            return;
        }

        const varName = (expression.left.object || expression.left).name;
        if (!this.#variables.has(varName)) return;

        const variable = this.#variables.get(varName);
        const { nodeDeclaration, originalKind } = variable

        // means changing an object property from a variable
        if (expression.left.type === 'MemberExpression') {
            this.#reportError(
                this.#messages.useConst(nodeDeclaration.kind),
                nodeDeclaration.loc.start
            );

            nodeDeclaration.kind = this.#variableTypes.const;
            this.#variables.set(varName, {
                ...variable,
                stage: this.#stages.expressionDeclaration,
                nodeDeclaration,
            });
            return
        }

        // means keeping the variable as it is
        if ([nodeDeclaration.kind, originalKind].includes(this.#variableTypes.let)) {
            this.#variables.set(varName, {
                ...variable,
                stage: this.#stages.expressionDeclaration,
                nodeDeclaration,
            });

            return;
        }
        // means reassigning a variable
        this.#reportError(
            this.#messages.useLet(nodeDeclaration.kind),
            nodeDeclaration.loc.start
        );

        nodeDeclaration.kind = this.#variableTypes.let;
        this.#variables.set(varName, {
            ...variable,
            stage: this.#stages.expressionDeclaration,
            nodeDeclaration,
        });
        return


    }

    handleVariableDeclaration(node) {
        for (const declaration of node.declarations) {
            const originalKind = node.kind;
            this.#variables.set(declaration.id.name, {
                originalKind,
                stage: this.#stages.declaration,
                nodeDeclaration: node
            });
        }
    }

    checkDeclarationsThatNeverChanged() {
        [...this.#variables.values()]
            .filter(({ stage, nodeDeclaration }) =>
                stage === this.#stages.declaration &&
                nodeDeclaration.kind !== this.#variableTypes.const
            )
            .forEach(({ nodeDeclaration }) => {

                this.#reportError(
                    this.#messages.useConst(nodeDeclaration.kind),
                    nodeDeclaration.loc.start
                );

                nodeDeclaration.kind = this.#variableTypes.const;
            });
    }

    #traverse(node) {
        const astHelper = new ASTHelper();
        astHelper
            .setLiteralHook(node => {
                this.#handleLiteral(node);
            })
            .setVariableDeclarationHook(node => {
                this.handleVariableDeclaration(node);
            })
            .setExpressionStatementHook(node => {
                this.#handleExpressionDeclaration(node);
            })
            .traverse(node);

        this.checkDeclarationsThatNeverChanged();
    }

    lint() {
        const code = fs.readFileSync(this.#filePath, 'utf-8');
        const ast = acorn.parse(code, {
            ecmaVersion: 2022,
            locations: true,
            sourceType: 'module',
            allowHashBang: true,
        });

        this.#traverse(ast);
        this.#notifyErrors();

        const updatedCode = astring.generate(ast, {
            comments: true,
        });
        fs.writeFileSync(this.#outputFile, updatedCode, 'utf-8');
        console.log(chalk.green('Code fixed and saved successfully.'));
        // console.log(chalk.green('Code without modifications:\n'));
        // console.log(updatedCode);
        console.log('\n');

        if (this.#errors.length === 0) {
            console.log(chalk.green('Linting completed without errors.'));
        } else {
            console.log(chalk.red(`Linting completed with ${this.#errors.length} error(s).`));
        }
    }
}


// check if the file path provided is in the current directory
const isQuokkaEnv = !!process.env.WALLABY_ENV
const getFileFromCLI = () => {
    try {
        const {
            values: {
                file
            },
        } = parseArgs({
            options: {
                file: {
                    type: 'string',
                    short: 'f',
                },
            }
        });
        // case -f or --file is not provided
        if(!file) throw new Error()

        return file;
    }
    catch (error) {
        console.error(chalk.red('Error: Please provide a file path as an argument.'));
        process.exit(1);
    }
}

const filePath = !isQuokkaEnv ? getFileFromCLI() : './error.js'

const eslintClone = new ESLintClone(filePath);
eslintClone.lint();
