const Configuration = require("./initialisers/config");
const Discord = require("discord.js");
const FileHound = require("filehound");
const Path = require("path");
const { WSEvents } = Discord.Constants;

const Bot = new Discord.Client({
  fetchAllMembers: true,
  disabledEvents: [ WSEvents.TYPING_START ]
});

async function listen() {
  let { Discord: DiscordConfig } = await Configuration;
  let { TOKEN } = DiscordConfig;

  let fileHound = FileHound.create()
    .path(Path.resolve(__dirname, "listeners"))
    .match("*.listener.js");

  fileHound.find();

  return new Promise((resolve, reject) => {
    fileHound.on("match", function(file) {
      let event = Path.basename(file, ".listener.js");
      let handler = require(file);

      Bot.on(event, handler);
    });

    fileHound.on("end", function() {
      // Log in, then resolve the promise
      resolve(Bot.login(TOKEN));
    });

    fileHound.on("error", reject);
  });
}

exports.listen = listen;
