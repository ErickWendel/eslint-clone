import fs from 'fs';
import * as acorn from 'acorn';

import chalk from 'chalk';
import escodegen from 'escodegen';
import ASTHelper from './astHelper.js';

class ESLintClone {
    constructor(filePath, fix) {
        this.filePath = filePath;
        this.fix = fix;
        this.errors = [];
    }

    reportError(message, { line, column }) {
        const errorLocation = `${this.filePath}:${line}:${column}`;
        const errorMessage = `${chalk.red('Error:')} ${message}`;

        console.error(`${errorMessage}\n${chalk.gray(errorLocation)}\n`);
        this.errors.push(errorMessage);
    }

    handleLiteral(node) {
        if (!(node.raw && typeof node.value === 'string'))
            return;

        const postion = node.loc.start;
        if (!node.raw.includes('"')) return
        const message = `Found double quotes "${node.value}"`;
        this.reportError(message, postion);
    }


    handleArrowFunctionExpression(node) {

    }
    #variables = new Map()
    handleExpressionDeclaration(node) {
        const { expression } = node;
        if (!expression.left) return;

        if (!expression.left.type === 'Identifier') {
            return;
        }

        const varName = (expression.left.object || expression.left).name;

        const { kind, stage, nodeDeclaration } = this.#variables.get(varName);
        const isDeclaration = stage === 'declaration'
        if (expression.left.type === 'MemberExpression' && isDeclaration) {
            nodeDeclaration.kind = 'const';
            this.#variables.set(varName, {
                kind: 'expressionDeclaration',
            });
            // console.log(`${varName} had a memberExpression and is const`)
            return
        }

        if (isDeclaration) {
            nodeDeclaration.kind = 'let';
            // console.log(`${varName} had a mutation and is let`)
            this.#variables.set(varName, {
                kind: 'expressionDeclaration',
            });
            return
        }

        if (!isDeclaration && kind === 'let') {
            // console.log(`${varName} had a mutation and kept as let`)
            return;
        }

    }
    handleVariableDeclaration(node) {
        for (const declaration of node.declarations) {
            node.kind = 'const';
            this.#variables.set(declaration.id.name, {
                kind: node.kind,
                stage: 'declaration',
                nodeDeclaration: node
            });
        }
    }


    #traverse(node) {
        const astHelper = new ASTHelper();
        astHelper
            .setLiteralHook(node => {
                this.handleLiteral(node);
            })
            .setVariableDeclarationHook(node => {
                this.handleVariableDeclaration(node)
            })
            .setExpressionStatementHook(node => {
                this.handleExpressionDeclaration(node)
            })

            .traverse(node);
    }


    lint() {
        const code = fs.readFileSync(this.filePath, 'utf-8');
        const ast = acorn.parse(code, { ecmaVersion: 2022, locations: true });

        this.#traverse(ast);

        const updatedCode = escodegen.generate(ast);
        console.log(chalk.green('Code with replacements:\n'));
        console.log(updatedCode);
        console.log('\n');

        if (this.errors.length === 0) {
            console.log(chalk.green('Linting completed without errors.'));
        } else {
            console.log(chalk.red(`Linting completed with ${this.errors.length} error(s).`));
        }
    }
}

const args = process.argv.slice(2);
const filePath = args[args.length - 1];
const fix = args.includes('-f') || args.includes('--fix');

if (!filePath) {
    console.error(chalk.red('Error: Please provide a file path as an argument.'));
    process.exit(1);
}

const eslintClone = new ESLintClone(filePath, fix);
eslintClone.lint();
