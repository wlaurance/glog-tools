(function() {
  var fs, program, rl;

  rl = require('readline');

  program = require('commander');

  fs = require('fs');

  exports.Writer = function() {
    var header, input;
    program.option('-f, --file [file]', 'File you want to start writing defaults to date+title.md').option('-g, --guido [file]', 'json file with author. Default => ./guido.json', './guido.json');
    program.parse(process.argv);
    header = {};
    input = rl.createInterface(process.stdin, process.stdout);
    return input.question('Title: ', function(title) {
      var defacto, now;
      if (title === '') title = "";
      header.title = title;
      now = new Date();
      defacto = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
      return input.question('Date (' + defacto + ')', function(dateChosen) {
        if (dateChosen === '') dateChosen = defacto;
        header.date = dateChosen;
        return fs.readFile(program.guido, function(err, stuff) {
          var defactoauthor;
          if (!err) defactoauthor = (JSON.parse(stuff)).author;
          if (defactoauthor === void 0) defactoauthor = '';
          return input.question('Author: ' + defactoauthor, function(author) {
            var file;
            if (author !== '') {
              header.author = author;
            } else if (defactoauthor !== '') {
              header.author = defactoauthor;
            }
            console.log(JSON.stringify(header));
            if (program.file == null) {
              file = header.date + (header.title.toLowerCase().split(' ').join('')) + '.md';
            }
            if (program.file != null) file = program.file;
            return fs.writeFile(file, JSON.stringify(header), function(err) {
              if (err != null) throw err;
              input.close();
              return process.stdin.destroy();
            });
          });
        });
      });
    });
  };

}).call(this);
