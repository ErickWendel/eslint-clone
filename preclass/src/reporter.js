import fs from 'node:fs';
import chalk from 'chalk';
import * as astring from 'astring';

class Reporter {
  static report({ errors, ast, outputFilePath }) {

    errors
      // sort by line number and column
      .sort((a, b) => {
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

    console.log(chalk.green('Code fixed and saved successfully.\n'));

    if (errors.length === 0) {
      console.log(chalk.green('Linting completed without errors.'));
    } else {
      console.log(chalk.red(`Linting completed with ${errors.length} error(s).`));
    }
  }
}

export default Reporter;
