let text = "abc12" + "cbd30220";
var neverReassigned = {};
neverReassigned.name = "erick wendel"

var toBeReassined = {}
toBeReassined = { name: "ana" }
toBeReassined.name = 1

toBeReassined = 0
toBeReassined = { name: "ana" }
// text = "aeeee"
// text = "aeeee"
// text = "aeeee"
// text = "aeeee"
// text = "aeeee"

let result = text.split(",").map(letter => {
    return letter.toUpperCase()
}).join(".")
console.log(result)