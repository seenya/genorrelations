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
                nodes[index1] = {index:index1,referenceCount:0,referencedNodes:[]};
            }
            if(!nodes[index2]) {
                nodes[index2] = {index:index2,referenceCount:0,referencedNodes:[]};
            }

            nodes[index1].referenceCount += 1;
            nodes[index1].referencedNodes.push(index2);
            nodes[index2].referenceCount += 1;
            nodes[index2].referencedNodes.push(index1);
        });

        var nodeCopy = JSON.parse(JSON.stringify(nodes));
        nodeCopy.sort(function(a,b){
            var aCount = a ? a.referenceCount : 0;
            var bCount = b ? b.referenceCount : 0;
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