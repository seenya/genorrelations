var fs = require('fs');

exports.index = function(req, res){
    res.render('index');
};

exports.visualise = function(req, res){
    var id = req.query.id;
    getGroupJSON(id, function(err, data) {
        res.render('visualise', data);
    });
};

var getGroupJSON = function(id, callback) {
    var filename = './data/' + id + '.json';
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err)
            callback(err);
        else {
            var jsonData = JSON.parse(data);
            callback(null, jsonData);
        }
    });
};