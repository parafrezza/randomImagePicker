const fs   = require('fs');
const path = require('path');
var http   = require('http');

var dir = ('./');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

exports.init = function()
{
    server = http.createServer(function (req, res) 
    {
        // var reqpath = req.url.toString().split('?')[0];
        if (req.method !== 'GET') {
            res.statusCode = 501;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Method not implemented');
        }
        var file = getImage()
        // var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
        if (file.indexOf(dir + path.sep) !== 0)
        {
            // console.log('yo %s', file.indexOf(dir + path.sep));
            // res.statusCode = 403;
            // res.setHeader('Content-Type', 'text/plain');
            // return res.end('Forbidden');
        }
        var type = mime[path.extname(file).slice(1)] || 'text/plain';
        var s = fs.createReadStream(file);
        s.on('open', function () {
            res.setHeader('Content-Type', type);
            s.pipe(res);
        });
        s.on('error', function () {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('Not found');
        });
    });


server.listen(3001, function () {
    console.log('Listening on http://localhost:3001/');
  });



function getImage()
{

    //Grabs a random index between 0 and length
    function randomIndex(length) {
        return Math.floor(Math.random() * (length));
    }

    //Read the directory and get the files
    const dirs = fs.readdirSync("./")
        .map(file => {
            return path.join("./", file);
        });

    const srcs_dup = [];
    const hashCheck = {}; //used to check if the file was already added to srcs_dup
    var numberOfFiles = dirs.length / 10; //OR whatever # you want
    var numberOfFiles = 1; //OR whatever # you want

    //While we haven't got the number of files we want. Loop.
    while (srcs_dup.length < numberOfFiles) {
        var fileIndex = randomIndex(dirs.length - 1);

        //Check if the file was already added to the array
        if (hashCheck[fileIndex] == true) {
            continue; //Already have that file. Skip it
        }

        //Add the file to the array and object
        srcs_dup.push(dirs[fileIndex]);
        hashCheck[fileIndex] = true;
    }

    console.log(srcs_dup[0]); //The list of your files
    return srcs_dup[0]
}

}