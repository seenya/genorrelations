var fs = require('fs');
var Transform = require('stream').Transform;

// call : node transfomer.js inputfile id name

var inputFilename = process.argv[2];
var id = process.argv[3];
var itemName = process.argv[4];
var outputFilename = "../data/" + id + ".json";

var source = fs.createReadStream(inputFilename);
var target = fs.createWriteStream(outputFilename);

var transform = new Transform({objectMode: false});
transform.header = null;
var nodeName = null;
var firstNode = true;
transform._transform = function (data, encoding, done) {
    var firstPart = null;
    var secondPart = null;
    if(!indiciesStarted) {
        chunk = data.toString();
        var indexOfClosingSquare = chunk.indexOf("]");
        if(indexOfClosingSquare >= 0) {
            if(indexOfClosingSquare > 0) {
                firstPart = chunk.substr(0, indexOfClosingSquare);
            }
            secondPart = chunk.substr(indexOfClosingSquare + 1);
        }
        else {
            firstPart = chunk;
        }
    }
    else {
        secondPart = data.toString();
    }

    if(firstPart) {
        var startIndex = 0;
        var indexOfQuote = chunk.indexOf("\"");
        var nodeNames = [];
        while(indexOfQuote >=0) {
            if(nodeName) {
                nodeName = nodeName + chunk.substr(startIndex, indexOfQuote);
                nodeNames.push(nodeName);
                nodeName = null;
                startIndex = indexOfQuote;
            }
            else {
                startIndex = indexOfQuote + 1;
                var endIndex = chunk.indexOf("\"", startIndex + 1);
                nodeNames.push(chunk.substr(startIndex, endIndex - startIndex));
                startIndex = endIndex;
            }
            indexOfQuote = chunk.indexOf("\"", startIndex + 1);
        }
        for(var i = 0; i < nodeNames.length; i++) {
            if(firstNode) {
                firstNode = false;
            }
            else {
                this.push(",");
            }
            this.push("{\"label\":\"" + nodeNames[i] + "\", \"radius\":5, \"fill\":\"#c2c2c2\", \"stroke\":\"#a6a6a6\"}");
        }
    }

    if(secondPart) {
        if(!indiciesStarted) {
            this.push("],\n\"edges\":");
            indiciesStarted = true;
        }
        this.push(secondPart);
    }

    done();
};
transform._flush = function(callback) {
    this.push("}");
};

var indiciesStarted = false;
target.write("{\"id\":");
target.write(id);
target.write(",\"name\":\"hematlas, celltype\",\n\"nodes\":[");
source.pipe(transform).pipe(target);


