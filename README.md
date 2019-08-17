## A JSON to go struct converter

### HTML generator usage

Just open the `index.html` file

### Node.js command line program usage

#### options

1. -i (required) specify the json file you want to convert
2. -n (required) specify the root struct name
3. -o (optional) specify the output file you want to write to

#### sample

`node index.js -i sample.json -n MyStruct -o mystruct.go`
