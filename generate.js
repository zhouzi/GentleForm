var fs     = require('fs');
var marked = require('marked');

module.exports = function generate (doneCallback) {
    fs.readFile('README.md', 'utf8', function (err, readmeContent) {
        if (err) throw err;

        fs.readFile('index.html', 'utf8', function (err, htmlContent) {
            if (err) throw err;

            fs.writeFile('index.html', htmlContent.replace(/(<main[^>]+>)[\s.]*(<\/main>)/g, function ($0, $1, $2) {
                return $1 + marked(readmeContent) + $2;
            }));
        });
    });
};