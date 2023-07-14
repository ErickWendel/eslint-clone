class SyntaxTreeProcessor {
  #filePath;
  #errors = new Map();
  #variables = new Map();
  #stages = {
    declaration: 'declaration',
    expressionDeclaration: 'expressionDeclaration',
  };
  #variableTypes = {
    var: 'var',
    let: 'let',
    const: 'const',
  };
  #messages = {
    singleQuotes: () => 'use single quotes instead of double quotes',
    useConst: (variableType) => `use "const" instead of ${variableType}`,
    useLet: (variableType) => `use "let" instead of ${variableType}`,
  };

  constructor(filePath) {
    this.#filePath = filePath;
  }

  #storeError(message, { line, column }) {
    const errorLocation = `${this.#filePath}:${line}:${column + 1}`;
    this.#errors.set(errorLocation, {
      message,
      errorLocation,
    });
  }

  #handleLiteral(node) {
    if (!(node.raw && typeof node.value === 'string')) {
      return;
    }
    const position = node.loc.start;
    if (!node.raw.includes(`"`)) {
      return;
    }
    node.raw = node.raw.replace(/"/g, `'`);
    this.#storeError(this.#messages.singleQuotes(), position);
  }

  #handleVariableDeclaration(node) {
    for (const declaration of node.declarations) {
      const originalKind = node.kind;

      this.#variables.set(declaration.id.name, {
        originalKind,
        stage: this.#stages.declaration,
        nodeDeclaration: node,
      });
    }
  }

  #handleExpressionDeclaration(node) {
    const { expression } = node;

    // console.log
    if(!expression.left) return;

    const varName = (expression.left.object || expression.left).name;
    console.log('varName', varName)
    if (!this.#variables.has(varName)) return;
    const variable = this.#variables.get(varName);
    const { nodeDeclaration, originalKind } = variable

    // means changing an object property from a variable
    if (
      expression.left.type === 'MemberExpression' &&
      variable.stage === this.#stages.declaration
    ) {
      // if already const, keep it
      if (originalKind === this.#variableTypes.const) return;

      this.#storeError(
        this.#messages.useConst(originalKind),
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
    this.#storeError(
      this.#messages.useLet(originalKind),
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

  #traverse(node) {
    const hooks = {
      Literal: (node) => this.#handleLiteral(node),
      VariableDeclaration: (node) => this.#handleVariableDeclaration(node),
      ExpressionStatement: (node) => this.#handleExpressionDeclaration(node),
    };
    hooks[node?.type]?.(node);
    for (const key in node) {
      if (typeof node[key] !== 'object') continue;
      this.#traverse(node[key]);
    }
  }

  process(node) {

    this.#traverse(node);
    this.#checkDeclarationsThatNeverChanged();

    return [...this.#errors.values()];
  }

  #checkDeclarationsThatNeverChanged() {
    [...this.#variables.values()]
      .filter(
        ({ stage, nodeDeclaration }) =>
          stage === this.#stages.declaration && nodeDeclaration.kind !== this.#variableTypes.const
      )

      .forEach(({ nodeDeclaration }) => {
        this.#storeError(this.#messages.useConst(nodeDeclaration.kind), nodeDeclaration.loc.start);

        nodeDeclaration.kind = this.#variableTypes.const;
      });
  }
}

export default SyntaxTreeProcessor;
