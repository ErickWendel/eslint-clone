# eslint-clone


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
- fix the replace by raw string by changing the AST Node correctly
- keep line breaks
- keep comments
- keep spaces
- don't put semicolons automatically
- report missing semicolon ';'
---
