const FS = require("fs").promises;
const Toml = require("toml");

async function config() {
  let configuration = await FS.readFile("../config/config.toml", {encoding: "utf8"});
  return Toml.parse(configuration);
}

module.exports = config();
