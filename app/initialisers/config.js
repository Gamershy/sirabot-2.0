const FS = require("fs").promises;
const Toml = require("toml");

async function config() {
  let configuration = await FS.readFile("./app/config/config.toml", "utf8");
  return Toml.parse(configuration);
}

module.exports = config();
