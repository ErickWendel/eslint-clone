var text = "abc123" + "cde9982"
var neverReassigned = {};
neverReassigned.name = "erick wendel"

var tobeReassined = {}
tobeReassined = { name: "ana" }
tobeReassined.name = 1
tobeReassined = 0
tobeReassined = { name: "ana" }
// text = "123"
// text = "123"
// text = "123"
// text = "123"

let result = text.split(",").map(letter => {
    return letter.toUpperCase()
}).join(".")
console.log(result)

