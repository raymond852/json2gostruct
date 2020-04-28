(function (global) {
  function json2struct(rootName, jsonTemplate, childNameDelimiter) {
    var outputGo = `type ${rootName} struct {`;

    if (!childNameDelimiter) {
      childNameDelimiter = "_";
    }
    var childrenEle = [];
    Object.keys(jsonTemplate).forEach(function (key) {
      var val = jsonTemplate[key];
      if (typeof val == "string") {
        outputGo = writeField(key, "string", outputGo);
      } else if (typeof val == "number") {
        if (val % 1 === 0) {
          outputGo = writeField(key, "int", outputGo);
        } else {
          outputGo = writeField(key, "float64", outputGo);
        }
      } else if (typeof val == "boolean") {
        outputGo = writeField(key, "bool", outputGo);
      } else if (Array.isArray(val)) {
        if (val.length == 0) {
          throw `key ${key} is array and has no elements`;
        } else {
          var arrEle = val[0];
          if (typeof arrEle == "string") {
            outputGo = writeField(key, "[]string", outputGo);
          } else if (typeof arrEle == "number") {
            if (arrEle % 1 === 0) {
              outputGo = writeField(key, "[]int", outputGo);
            } else {
              outputGo = writeField(key, "[]float64", outputGo);
            }
          } else if (typeof arrEle == "boolean") {
            outputGo = writeField(key, "[]bool", outputGo);
          } else if (Array.isArray(arrEle)) {
            throw `field ${key} error, array as array element is not supported`;
          } else {
            var childName =
              rootName + childNameDelimiter + upperCaseFirstLetter(key);
            childrenEle.push({
              name: childName,
              val: arrEle,
            });
            outputGo = writeField(key, "[]" + childName, outputGo);
          }
        }
      } else {
        var childName =
          rootName + childNameDelimiter + upperCaseFirstLetter(key);
        childrenEle.push({
          name: childName,
          val: val,
        });
        outputGo = writeField(key, childName, outputGo);
      }
    });
    outputGo += "\n}\n";

    for (var i = 0; i < childrenEle.length; i++) {
      outputGo += "\n";
      outputGo += json2struct(
        childrenEle[i].name,
        childrenEle[i].val,
        null,
        childNameDelimiter
      );
    }
    return outputGo;
  }

  function writeField(name, type, origin) {
    var ret = newlineIndent(4, origin);
    ret = ret + upperCaseFirstLetter(name) + " ";
    ret = ret + type + " ";
    ret = ret + '`json:"' + name + '"`';
    return ret;
  }

  function upperCaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function newlineIndent(indent, origin) {
    var ret = origin;
    ret = ret + "\n";
    for (var i = 0; i < indent; i++) {
      ret = ret + " ";
    }
    return ret;
  }

  if (
    typeof module === "object" &&
    module &&
    typeof module.exports === "object"
  ) {
    module.exports = json2struct;
  } else {
    global.json2struct = json2struct;
  }
})(this);
