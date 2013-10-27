var fs = require('fs');

var id = process.argv[2];

var filename = './data/' + id + '.json';
var metaFilename = './data/' + id + '.meta.json';
fs.readFile(filename, 'utf8', function (err, data) {
    if (err)
        console.log(err);
    else {
        var jsonData = JSON.parse(data);
        
        var metaData = {nodes:[], topReferencedIndexes:[]};
        var nodes = metaData.nodes;

        jsonData.edges.forEach(function(data) {
            var index1 = data[0];
            var index2 = data[1];

            if(!nodes[index1]) {
                nodes[index1] = {index:index1,references: {count:0,nodes:[]}, positiveReferences: {count:0,nodes:[]}, negativeReferences: {count:0,nodes:[]}};
            }
            if(!nodes[index2]) {
                nodes[index2] = {index:index2,references: {count:0,nodes:[]}, positiveReferences: {count:0,nodes:[]}, negativeReferences: {count:0,nodes:[]}};
            }

            nodes[index1].references.count += 1;
            nodes[index1].references.nodes.push(index2);
            nodes[index2].references.count += 1;
            nodes[index2].references.nodes.push(index1);

            var correlationReference1 = null;
            var correlationReference2 = null;
            if(data[2] >= 0) {
                correlationReference1 = nodes[index1].positiveReferences;
                correlationReference2 = nodes[index2].positiveReferences;
            }
            else {
                correlationReference1 = nodes[index1].negativeReferences;
                correlationReference2 = nodes[index2].negativeReferences;
            }

            correlationReference1.count += 1;
            correlationReference1.nodes.push(index2);
            correlationReference2.count += 1;
            correlationReference2.nodes.push(index1);
           
        });

        var nodeCopy = JSON.parse(JSON.stringify(nodes));
        nodeCopy.sort(function(a,b){
            var aCount = a ? a.references.count : 0;
            var bCount = b ? b.references.count : 0;
            return bCount-aCount;
        });

        for(var i = 0; i < 5 && i < nodeCopy.length; i++) {
            var geneIndex = nodeCopy[i].index;
            metaData.topReferencedIndexes.push({geneName:jsonData.nodes[geneIndex].name, geneIndex:geneIndex});
        }

        fs.writeFile(metaFilename, JSON.stringify(metaData), function(err) {
            if(err)
                console.log(err);
            else
                console.log("complete");
        });
    }
});