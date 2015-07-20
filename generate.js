var fs     = require('fs');
var marked = require('marked');

module.exports = function generate (doneCallback) {
    fs.readFile('README.md', 'utf8', function (err, readmeContent) {
        if (err) throw err;

        fs.readFile('index.html', 'utf8', function (err, htmlContent) {
            if (err) throw err;

            var htmlDoc = htmlContent.replace(/(<main[^>]+>)[^]+(<\/main>)/g, function ($0, $1, $2) {
                return $1 + marked(readmeContent) + $2;
            });

            fs.writeFile('index.html', htmlDoc);
            doneCallback();
        });
    });
};