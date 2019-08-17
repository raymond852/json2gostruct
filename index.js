var json2struct = require("./lib");
var fs = require('fs');

var inputIndex = process.argv.indexOf("-i");
var rootNameIndex = process.argv.indexOf("-n");
var outputFileIndex = process.argv.indexOf("-o");

if (inputIndex > 0 && rootNameIndex > 0) {
    if (process.argv.length > inputIndex + 1 && process.argv.length > rootNameIndex + 1) {
        var fileContent = fs.readFileSync(process.argv[inputIndex + 1]);
        var fileContentJson = JSON.parse(fileContent);
        var out = json2struct(process.argv[rootNameIndex + 1], fileContentJson);
        if (outputFileIndex > 0 && process.argv.length > outputFileIndex + 1) {
            fs.writeFileSync(process.argv[outputFileIndex + 1], out);
        } else {
            console.log(out);
        }
        return
    }
}

console.log(
    "Available options:\n\t-i (required) specify the input file which contains the json\n\t-n (required) specify the root name of the go struct\n\t-o (optional) specify the output file"
);