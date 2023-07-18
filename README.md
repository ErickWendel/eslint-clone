# ESLint Reimagined: Creating a Linter from Scratch

Welcome, this repo is part of my [**youtube video**](https://bit.ly/eslint-clone-ew) about **Creating your own ESLint from scratch (en-us)**

First of all, leave your star 🌟 on this repo.

Access our [**exclusive telegram channel**](https://t.me/ErickWendelContentHub) so I'll let you know about all the content I've been producing 

## Complete source code
- Access it in [app](./recorded/)

  
![ESLint Reimagined-thumb](https://github.com/ErickWendel/eslint-clone/assets/8060102/086f9a26-a056-45d2-be36-07a8b73c96b0)


## Usage
```shell
nvm use
npm i
npm link
eslint-clone --file filename.js
```
##
## Example

```shell
eslint-clone --file error.js
```

Outputs
```shell
Error: use "const" instead of "var"
error.js:1:1
Error: use single quotes instead of double quotes
error.js:1:12
Error: use single quotes instead of double quotes
error.js:1:23
Error: use "const" instead of "var"
error.js:2:1
Error: use single quotes instead of double quotes
error.js:3:24
Error: use "let" instead of "var"
error.js:5:1
Error: use single quotes instead of double quotes
error.js:6:25
Error: use single quotes instead of double quotes
error.js:9:25
Error: use "const" instead of "let"
error.js:15:1
Error: use single quotes instead of double quotes
error.js:15:25
Error: use single quotes instead of double quotes
error.js:17:9
Linting completed with 11 error(s).

Code fixed and saved at ./error.linted.js successfully!
```

## Cleaning Up

```shell
npm unlink eslint-clone
```

## Tasks
- fix the bug when replacing quotes
    - if a code have single quotes enclosing double quotes such as:

         ```js
        const name = '"ana"'
        ```

        it'd be transformed as below and will cause a syntax error.

        ```js
        const name = ''ana''
        ```

    - **How to fix:** replace it to a template string instead.
        - Input:
            ```js
            '"double"'.replaceAll('"', "'");
            ```
        - Current Output:
            ```js
            ''double''.replaceAll(''', ''');
            ```
        - Expected Output:
            ```js
            `"double"`.replaceAll(`"`, `'`);
            ```
- keep line breaks
- keep comments
- keep spaces
- don't put semicolons automatically
- report missing semicolon ';'
---
