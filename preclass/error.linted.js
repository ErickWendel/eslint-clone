const text = 'abc12' + 'cbd300';
const neverReassigned = {};
neverReassigned.name = 'erick wendel';
let reassignes = {};
reassignes = { name: 'ana' };
reassignes.name = 1;
reassignes = 0;
const result = text.split(',').map(letter => {
    return letter.toUpperCase();
}).join('.');
console.log(result);