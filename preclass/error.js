var text = "abc12" + "cbd30220";
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

const result = text.split(",").map(letter => {
    return letter.toUpperCase()
}).join(".")
console.log(result)

/*
1 change text to let = should be transformed to const
2 reassign text = should be kept to let
3 change text to var = should be transformed to let
4 change text to const and remove reassign = should be kept to const
*/