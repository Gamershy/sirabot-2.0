const FileHound = require("filehound");
const path = require("path");

module.exports = FileHound.create()
  .path(path.join(__dirname, "initializers"))
  .ext("js")
  .depth(2)
  .find()
  .then(function(initializers) {
    return Promise.all(initializers.map(file => require(file)));
  });
