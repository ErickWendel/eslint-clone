import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import * as astring from 'astring';

class Reporter {
  static report({ errors, ast, outputFilePath }) {

    errors
      .sort((a, b) => {
        // error.js:19:9 [line 19, colum 9]
        const [aLine, aColumn] = a.errorLocation.split(':').slice(1);
        const [bLine, bColumn] = b.errorLocation.split(':').slice(1);
        if (aLine === bLine) {
          return aColumn - bColumn;
        }
        return aLine - bLine;
      })
      .forEach(({ message, errorLocation }) => {
        const errorMessage = `${chalk.red('Error:')} ${message}`;
        const finalMessage = `${errorMessage}\n${chalk.gray(errorLocation)}\n`;
        console.error(finalMessage);
      });

    const updatedCode = astring.generate(ast);
    fs.writeFileSync(outputFilePath, updatedCode, 'utf-8');

    if (!errors.length) {
      console.log(chalk.green('Linting completed without errors.'));
    } else {
      console.log(chalk.red(`Linting completed with ${errors.length} error(s).`));
    }
    console.log(
      chalk.green('\nCode fixed and saved at'),
      chalk.yellow('./' + path.basename(outputFilePath)),
      chalk.green('successfully.')
    );
  }
}

export default Reporter;
