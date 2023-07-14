const text = 'abc123' + 'cde9982';
const neverReassigned = {};
neverReassigned.name = 'erick wendel';
let tobeReassined = {};
tobeReassined = {
  name: 'ana'
};
tobeReassined.name = 1;
tobeReassined = 0;
tobeReassined = {
  name: 'ana'
};
const result = text.split(',').map(letter => {
  return letter.toUpperCase();
}).join('.');
console.log(result);
