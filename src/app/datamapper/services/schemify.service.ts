import { Injectable } from '@angular/core';

@Injectable()
export class SchemifyService {

  constructor() { }


  initSchema = () => {
    var schema = {
      "$schema": "http://json-schema.org/draft-04/schema#"
    };
    return schema;
  }
  JSONtoJSONSchema = function (obj) {
    var schema = this.initSchema();
    if (Object.keys(obj).length === 1) {
      var title = Object.keys(obj)[0];
      schema.title = title;
      obj = obj[title];
    }

    var objType = typeof obj;
    schema.type = objType;
    if (objType !== "object") {
      schema.properties = {};
      return schema;

    }
    var str = Array.isArray(obj) ? "items" : "properties";
    schema[str] = {};

    (function traverse(obj, result) {
      var keys = Object.keys(obj);
      keys.map(function (key) {
        var subject = obj[key],
          type = typeof subject;
        //if type is object or array
        if (type === "object") {
          //if Array
          if (Array.isArray(subject)) {
            result[key] = {
              "type": "array"
            };
            var arrayType = typeof subject[0];
            var tempObject = {
              "items": {}
            };
            if (arrayType !== "object") {
              // tempObject.items.type = arrayType;
              result[key].items = tempObject.items;
              return true;
            } else {
              tempObject.items = subject[0];
              return traverse(tempObject, result[key]);
            }
          } else {
            result[key] = {
              "type": type,
              "properties": {}
            };
            return traverse(subject, result[key].properties);
          }
        } else { //if leaf type
          result[key] = {
            "type": type
          };
          return true;
        }
      });
    })(obj, schema[str]);
    return schema;
  }

  XMLtoJSONSchema = function (xmlText) {
    var schema = this.initSchema(),
      self = this,

      //parse XML tree
      root = this.parseXMLTree(xmlText);

    schema.title = root.tagName;
    schema.type = "object";
    schema.properties = {};
    var namespace = "";
    if (root.attributes.length > 0) {
      var obj = {};
      for (var j = 0; j < root.attributes.length; j++) {
        var attr = root.attributes[j];
        //skip xmlns stuff
        if (!attr.name.includes("xmlns")) {
          obj[attr.name] = {
            "type": self.getType(attr.textContent)
          }
        } else {
          if (attr.value.includes("www.w3.org") && attr.name.split(":").length > 1) {
            namespace = attr.name.split(":")[1];
          }
        }
      }
      schema.attributes = obj;
    }
    for (var i = 0; i < root.children.length; i++) {
      traverseXMLTree(root.children[i], schema["properties"]);
    }

    function traverseXMLTree(rootNode, parent) {
      var children = rootNode.children;
      var attributes = rootNode.attributes;
      var title = rootNode.tagName;

      //check if there is xsi:type... and add attributes
      var myAttributes = {};
      if (attributes.length > 0) {
        for (var j = 0; j < attributes.length; j++) {
          var attr = attributes[j];
          if (!attr.name.includes("xmlns")) {

            //if there is (xsi:type) add the value to title
            if (attr.name === namespace + ":type") {
              title = title + ":" + attr.value;
            } //else {
            myAttributes[attr.name] = {
              "type": self.getType(attr.textContent)
            }
            //                        }
          }

        }
      }


      var isArray = parent[title] ? true : false;


      if (isArray) { //if array
        parent[title]["type"] = "array";
        if (parent[title]["properties"]) {
          parent[title]["items"] = {
            "type": "object",
            "properties": parent[title]["properties"],
          }

          delete parent[title]["properties"];
        }

        return;
      } else {
        parent[title] = {
          "type": self.getType(rootNode.textContent)
        };
      }
      if (children.length === 0 && attributes.length === 0) {
        return;
      } else {

        //add children
        if (children.length !== 0) {
          parent[title] = {
            "type": "object",
            "properties": {}
          };
          var nestParent = parent[title]["properties"];
          //    $("#" + resultBox).append(nodeName);
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            traverseXMLTree(child, nestParent);
          }
        }

        //add attributes
        if (attributes.length !== 0) {
          parent[title]["attributes"] = myAttributes;
        }
      }
    }

    return schema;
  }

  XSDtoJSONSchema = function (xsdText) {
    var self = this;
    var schema = this.initSchema();
    schema["title"] = "Root",
      schema["properties"] = {},
      schema["type"] = "object",
      schema["attributes"] = {};

    var root = this.parseXMLTree(xsdText);

    var complexTypes = {};
    var ignoreTags = ["any", "anyAttribute", "sequence", "all", "choice", "annotation", "documentation"];

    var namespaces = []; //the first entry is default namespace
    var schemaAttributes = root.attributes;
    var generalElements = root.children;
    var globalElements = [];


    //filter the namespaces eg.xs,xsd,xsi...
    for (var i = 0; i < schemaAttributes.length; i++) {
      var attr = schemaAttributes[i];
      var splitKey = attr.name.split(":");
      if (splitKey.length > 1 && splitKey[0] === "xmlns") {
        namespaces.push(splitKey[1]);
        if (attr.value.includes("http://www.w3.org") && i !== 0) { //set primary as first
          var prim = namespaces.pop();
          namespaces.push(namespaces[0]);
          namespaces[0] = prim;
        }
      }
    }
    //        console.log(namespaces);


    //filter definitions in root
    var definitions = {};
    for (var i = 0; i < root.children.length; i++) {
      var child = root.children[i];
      if (child.attributes.name) {
        definitions[child.attributes.name.value] = {};
        var res = traverseXSDTree(child, definitions[child.attributes.name.value], child.attributes.name.value);

      }
      if (child.tagName === namespaces[0] + ":element") {
        globalElements.push(child);
      }
    }
    console.log(JSON.stringify(definitions, null, 4));


    //set the root
    var schemaRoot = globalElements[0];
    //        console.log(globalElements);
    if (globalElements.length > 1) {
      console.log("multiple possible roots - first possible element selected");
      //if no child elements and primary - select next
      var count = globalElements.length - 1;
      while (count >= 0) {
        schemaRoot = globalElements[count];
        if (schemaRoot.children.length !== 0 || !isPrimaryType(schemaRoot.attributes.type.value)) {
          break;
        }
        count--;
      }
    }
    var rootTitle = schemaRoot.attributes.name.value;
    schema["title"] = rootTitle;
    schemaRoot = definitions[rootTitle];
    //        console.log(schemaRoot.attributes.name);

    var myCount = 0;
    //create schema from root
    createSchemaFromDefs(schemaRoot, schema);


    //create the schema using the calculated definitions
    function createSchemaFromDefs(rootObj, target) {
      for (var kk = 0; kk < Object.keys(rootObj).length; kk++) {
        var key = Object.keys(rootObj)[kk];
        var val = rootObj[key];
        if (typeof val === "object") {
          var tempTarget = target;

          target["properties"] = target["properties"] || {};
          tempTarget = target["properties"];


          if (val["isAttribute"]) { //iff attribute - change the target location
            target["attributes"] = target["attributes"] || {};
            tempTarget = target["attributes"];
          }

          if (val["type"] && definitions[val.type]) { //if the type is a definition, choose it as the subject
            val = definitions[val.type];
          }

          if (val["isLeaf"]) {
            //if a leaf node - add it to the target
            tempTarget[key] = val;

          } else {
            if (val["isGroupDef"]) {
              //if the definition is group - use the parent target (not in a new nested child)
              tempTarget = target;
              createSchemaFromDefs(val, tempTarget);
            } else {
              tempTarget[key] = {};
              tempTarget[key]["type"] = "object";
              createSchemaFromDefs(val, tempTarget[key]);

            }
          }
        } else {
          if (key === "type" && definitions[val]) {
            if (!definitions[val]["isLeaf"]) {
              createSchemaFromDefs(definitions[val], target);
            }
          }
        }
      }
    }


    //traverse the items and add to definitions
    function traverseXSDTree(root, result, title) {
      var obj = result;
      var tagName = getTagName(root.tagName);
      if (ignoreTags.indexOf(tagName) > -1 || ((tagName === "complexType" || tagName === "simpleType") && !root.attributes.length) || tagName === "restriction") { //if the tag is
        obj = result;
      } else {
        var tempName = root.attributes.name || root.attributes.ref;
        if (tempName) {
          if (tagName !== "complexType" && tagName !== "simpleType") {
            var rootName = tempName.value;
            if (rootName !== title) {
              result[rootName] = {};
              obj = result[rootName];
            }
          } else {
            obj = result;
          }
          if (tagName === "group") {
            obj["isGroupDef"] = true;
          }
        }
      }

      if (root.children.length === 0) {
        for (var j = 0; j < root.attributes.length; j++) {
          var attr = root.attributes[j];
          if (attr.name === "type") {
            if (isPrimaryType(attr.value)) {
              obj["isLeaf"] = true;
            }
            obj["type"] = getTagName(attr.value) || attr.value;
          } else if (attr.name === "ref") {
            obj["type"] = attr.value;
          } else {
            obj[attr.name] = attr.value;
          }
        }
        if (tagName === "attribute") {
          obj["isAttribute"] = true;
        }
        return result;
      }

      if (getTagName(root.parentElement.tagName) === "simpleType" && root.attributes.base) {
        //                console.log(obj);
        obj["type"] = getTagName(root.attributes.base.value);
        obj["isLeaf"] = true;
        //                console.log(obj);
        return result;
      }

      for (var i = 0; i < root.children.length; i++) {
        var child = root.children[i];
        var res = traverseXSDTree(child, obj, "");
      }
      return result;
    }



    function getTagName(name) {
      var keys = name.split(":");
      if (keys.length == 2 && namespaces.indexOf(keys[0] > -1)) {
        return keys[1];
      }
    }

    function isPrimaryType(type) {
      var keys = type.split(":");
      if (keys.length == 2 && namespaces[0] === keys[0]) {
        return keys[1];
      } else {
        return false;
      }
    }

    return schema;
  }
  parseXMLTree = function (xmlText) {
    let parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, "text/xml");
    // documentElement always represents the root node
    var root = xmlDoc.documentElement;
    return root;
  }

  getType = function (text) {
    if (text === "true" || text === "false") {
      return "boolean";
    }
    if (!isNaN(Number(text))) {
      return "number";
    }
    return "string";
  }


  //
  //  CSVParser.js
  //  Mr-Data-Converter
  //
  //  Input CSV or Tab-delimited data and this will parse it into a Data Grid Javascript object
  //
  //  CSV Parsing Function from Ben Nadel, http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm



  CSVParser = {

    isDecimal_re : /^\s*(\+|-)?((\d+([,\.]\d+)?)|([,\.]\d+))\s*$/,
    //---------------------------------------
    // UTILS
    //---------------------------------------

    isNumber: function (string) {
      if ((string == null) || isNaN(string)) {
        return false;
      }
      return true;
    },


    //---------------------------------------
    // PARSE
    //---------------------------------------
    //var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);

    parse: function (input, headersIncluded, delimiterType, downcaseHeaders, upcaseHeaders, decimalSign) {

      var dataArray = [];

      var errors = [];

      //test for delimiter
      //count the number of commas
      var RE = new RegExp("[^,]", "gi");
      var numCommas = input.replace(RE, "").length;

      //count the number of tabs
      RE = new RegExp("[^\t]", "gi");
      var numTabs = input.replace(RE, "").length;

      var rowDelimiter = "\n";
      //set delimiter
      var columnDelimiter = ",";
      if (numTabs > numCommas) {
        columnDelimiter = "\t"
      };

      if (delimiterType === "comma") {
        columnDelimiter = ","
      } else if (delimiterType === "tab") {
        columnDelimiter = "\t"
      }


      // kill extra empty lines
      RE = new RegExp("^" + rowDelimiter + "+", "gi");
      input = input.replace(RE, "");
      RE = new RegExp(rowDelimiter + "+$", "gi");
      input = input.replace(RE, "");

      // var arr = input.split(rowDelimiter);
      //
      // for (var i=0; i < arr.length; i++) {
      //   dataArray.push(arr[i].split(columnDelimiter));
      // };


      // dataArray = jQuery.csv(columnDelimiter)(input);
      dataArray = this.CSVToArray(input, columnDelimiter);

      //escape out any tabs or returns or new lines
      for (var i = dataArray.length - 1; i >= 0; i--) {
        for (var j = dataArray[i].length - 1; j >= 0; j--) {
          dataArray[i][j] = dataArray[i][j].replace("\t", "\\t");
          dataArray[i][j] = dataArray[i][j].replace("\n", "\\n");
          dataArray[i][j] = dataArray[i][j].replace("\r", "\\r");


        };
      };


      var headerNames = [];
      var headerTypes = [];
      var numColumns = dataArray[0].length;
      var numRows = dataArray.length;
      if (headersIncluded) {

        //remove header row
        headerNames = dataArray.splice(0, 1)[0];
        numRows = dataArray.length;

      } else { //if no headerNames provided

        //create generic property names
        for (var i = 0; i < numColumns; i++) {
          headerNames.push("val" + String(i));
          headerTypes.push("");
        };

      }


      if (upcaseHeaders) {
        for (var i = headerNames.length - 1; i >= 0; i--) {
          headerNames[i] = headerNames[i].toUpperCase();
        };
      };
      if (downcaseHeaders) {
        for (var i = headerNames.length - 1; i >= 0; i--) {
          headerNames[i] = headerNames[i].toLowerCase();
        };
      };

      //test all the rows for proper number of columns.
      for (var i = 0; i < dataArray.length; i++) {
        var numValues = dataArray[i].length;
        if (numValues != numColumns) {
          this.log("Error parsing row " + String(i) + ". Wrong number of columns.")
        };
      };

      //test columns for number data type
      var numRowsToTest = dataArray.length;
      var threshold = 0.9;
      for (var i = 0; i < headerNames.length; i++) {
        var numFloats = 0;
        var numInts = 0;
        var isBoolean = [];
        for (var r = 0; r < numRowsToTest; r++) {
          if (dataArray[r]) {
            //replace comma with dot if comma is decimal separator
            if (decimalSign = 'comma' && this.isDecimal_re.test(dataArray[r][i])) {
              dataArray[r][i] = dataArray[r][i].replace(",", ".");
            }
            if (this.isNumber(dataArray[r][i])) {
              numInts++
              if (String(dataArray[r][i]).indexOf(".") > 0) {
                numFloats++
              }
            }
            if (dataArray[r][i] === "true" || dataArray[r][i] === "false") {
              isBoolean.push(true);
            }
          };

        };

        if ((numInts / numRowsToTest) > threshold) {
          if (numFloats > 0) {
            headerTypes[i] = "float"
          } else {
            headerTypes[i] = "int"
          }
        } else {
          headerTypes[i] = isBoolean.length === numRowsToTest ? "boolean" : "string"
        }
      }





      return {
        'dataGrid': dataArray,
        'headerNames': headerNames,
        'headerTypes': headerTypes,
        'errors': this.getLog()
      }

    },


    //---------------------------------------
    // ERROR LOGGING
    //---------------------------------------
    errorLog: [],

    resetLog: function () {
      this.errorLog = [];
    },

    log: function (l) {
      this.errorLog.push(l);
    },

    getLog: function () {
      var out = "";
      if (this.errorLog.length > 0) {
        for (var i = 0; i < this.errorLog.length; i++) {
          out += ("!!" + this.errorLog[i] + "!!\n");
        };
        out += "\n"
      };

      return out;
    },



    //---------------------------------------
    // UTIL
    //---------------------------------------

    // This Function from Ben Nadel, http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    CSVToArray: function (strData, strDelimiter) {
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
        (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
      );


      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;


      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
          strMatchedDelimiter.length &&
          (strMatchedDelimiter != strDelimiter)
        ) {

          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push([]);

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"),
            "\""
          );

        } else {

          // We found a non-quoted value.
          var strMatchedValue = arrMatches[3];

        }



        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
      }

      // Return the parsed data.
      return (arrData);
    }



  }
}
