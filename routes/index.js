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

var getGroupJSON = function(id, geneIndex, callback) {
    var filename = './data/' + id + '.json';
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err)
            callback(err);
        else {
            var jsonData = JSON.parse(data);
            // Add the d3 attributes to the node names
            jsonData.nodes.forEach(function(node) {
                node.label = node.name;
                node.radius = 5;
                node.fill = "#c2c2c2";
                node.stroke = "#a6a6a6";
            });
            callback(null, jsonData);
        }
    });
};