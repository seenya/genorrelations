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
    composedJSON.nodes = data.nodes;
    composedJSON.edges = data.edges;
    composedJSON.topGenes = metadata.topReferencedIndexes;

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