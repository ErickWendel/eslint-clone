export default class ASTHelper {
    #variableDeclarationHook = () => { };
    #functionDeclarationHook = () => { };
    #identifierHook = () => { };
    #literalHook = () => { };
    #expressionStatementHook = () => { };

    setExpressionStatementHook(fn) {
        this.#expressionStatementHook = fn;
        return this
    }

    setLiteralHook(fn) {
        this.#literalHook = fn;
        return this
    }

    setVariableDeclarationHook(fn) {
        this.#variableDeclarationHook = fn;
        return this
    }
    setFunctionDeclarationHook(fn) {
        this.#functionDeclarationHook = fn;
        return this
    }
    setIdentifierHook(fn) {
        this.#identifierHook = fn;
        return this
    }

    traverse(node) {
        const handlers = {
            FunctionDeclaration: this.#functionDeclarationHook,
            VariableDeclaration: this.#variableDeclarationHook,
            Literal: this.#literalHook,
            ExpressionStatement: this.#expressionStatementHook,
            // where the refence is being used
            Identifier: this.#identifierHook
        }
        handlers[node?.type]?.(node);
        for (const key in node) {
            if (typeof node[key] !== 'object') continue;
            this.traverse(node[key]);
        }
    }
}