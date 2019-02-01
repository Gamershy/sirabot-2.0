const FileHound = require("filehound");
const path = require("path");

module.exports = FileHound.create()
  .path(path.join(__dirname, "initialisers"))
  .ext("js")
  .depth(2)
  .find()
  .then(function(initialisers) {
    return Promise.all(initialisers.map(file => require(file)));
  });
