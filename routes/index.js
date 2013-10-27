var fs = require('fs');

exports.index = function(req, res){
    res.render('index');
};

exports.visualise = function(req, res){
    var id = req.query.id;
    var geneId = req.query.geneId;
    getGroupJSON(id, geneId, function(err, data) {
        res.render('visualise', data);
    });
};

var composeJSON = function(geneIndex, data, metadata) {
    var composedJSON = {};

    composedJSON.name = data.name;
    composedJSON.topGenes = metadata.topReferencedIndexes;

    if(!geneIndex) {
        geneIndex = composedJSON.topGenes[0].geneIndex;
    }

    var geneMetaData = metadata.nodes[geneIndex];
    var indexMapping = [];
    var filteredNodes = [];
    var filteredEdges = [];

    data.nodes.forEach(function(gene, idx) {
        if(idx === geneIndex || geneMetaData.referencedNodes.indexOf(idx) >= 0) {
            filteredNodes.push(gene);
            indexMapping[idx] = filteredNodes.length - 1;
        }
    });

    console.log("original node count: " + data.nodes.length);
    console.log("new node count: "  + filteredNodes.length);

    data.edges.forEach(function(edge) {
        var mappedIndex1 = indexMapping[edge[0]];
        var mappedIndex2 = indexMapping[edge[1]];
        if(mappedIndex1 && mappedIndex2) {
            var mappedEdge = [mappedIndex1, mappedIndex2, edge[2]];
            filteredEdges.push(mappedEdge);
        }
    });

    console.log("original edge count: " + data.edges.length);
    console.log("new edge count: " + filteredEdges.length);

    composedJSON.nodes = filteredNodes;
    composedJSON.edges = filteredEdges;

   // Add the d3 attributes to the node names
    composedJSON.nodes.forEach(function(node) {
        node.label = node.name;
        node.radius = 5;
        node.fill = "#c2c2c2";
        node.stroke = "#a6a6a6";
    });

    return composedJSON;
};

var getGroupJSON = function(id, geneIndex, callback) {
    var filename = './data/' + id + '.json';
    var metaFilename = './data/' + id + '.meta.json';
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err)
            callback(err);
        else {
            var jsonData = JSON.parse(data);
 
            fs.readFile(metaFilename, 'utf8', function (err, data) {
                if (err)
                    callback(err);
                else {
                    var metadata = JSON.parse(data);
                    callback(null, composeJSON(geneIndex, jsonData, metadata));
                }
            });
        }
    });
};