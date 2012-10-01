rl = require 'readline'
program = require 'commander'
fs = require 'fs'

exports.Writer = ->
  program
    .option('-f, --file [file]', 'File you want to start writing defaults to date+title.ext')
    .option('-e, --extension [string]', 'ext you want to use.', 'md')
    .option('-g, --guido [file]', 'json file with author. Default => ./guido.json', './guido.json')
  program.parse process.argv
  header = {}
  input = rl.createInterface process.stdin, process.stdout
  input.question 'Title: ', (title)->
    title = "" if title is ''
    header.title = title
    now = new Date()
    defacto = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear()
    input.question 'Date (' + defacto + ')', (dateChosen)->
      dateChosen = defacto if dateChosen is ''
      header.date = dateChosen
      fs.readFile program.guido, (err, stuff)->
        defactoauthor = (JSON.parse stuff).author if not err
        defactoauthor = '' if defactoauthor is undefined
        input.question 'Author: ' + defactoauthor, (author)->
          if author isnt ''
            header.author = author
          else if defactoauthor isnt ''
            header.author = defactoauthor
          console.log JSON.stringify header
          file = header.date + (header.title.toLowerCase().split(' ').join('')) + '.' + program.extension unless program.file?
          file = program.file if program.file?
          fs.writeFile file, JSON.stringify(header), (err)->
            throw err if err?
            input.close()
            process.stdin.destroy()

