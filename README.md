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
Error: use "const" instead of var
error.js:1:1

Error: use single quotes instead of double quotes
error.js:1:12

Error: use single quotes instead of double quotes
error.js:1:22

Error: use "const" instead of var
error.js:2:1

Error: use single quotes instead of double quotes
error.js:3:24

Error: use "let" instead of var
error.js:5:1

Error: use "const" instead of let
error.js:5:1

Error: use "let" instead of const
error.js:5:1

Error: use single quotes instead of double quotes
error.js:6:22

Error: use "const" instead of var
error.js:16:1

Error: use single quotes instead of double quotes
error.js:16:25

Error: use single quotes instead of double quotes
error.js:18:9

Code fixed and saved successfully.
```

## Cleaning Up

```shell
npm unlink eslint-clone
```