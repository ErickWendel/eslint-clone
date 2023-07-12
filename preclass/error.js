let text = "abc12" + "cbd300";
var neverReassigned = {};
neverReassigned.name = "erick wendel"

var reassignes = {}
reassignes = { name: "ana" }
reassignes.name = 1

reassignes = 0

const result = text.split(",").map(letter => {
    return letter.toUpperCase()
}).join(".")
console.log(result)