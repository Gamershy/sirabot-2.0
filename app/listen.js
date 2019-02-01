const {
  Client,
  Constants
} = require("discord.js");

const {
  Status,
  WSEvents
} = Constants;

const Bot = new Client({
  fetchAllMembers: true,
  disabledEvents: [ WSEvents.TYPING_START ]
});

const Configuration = require("./initialisers/config");
const FileHound = require("filehound");
const Path = require("path");

async function listen() {
  if (Bot.status === Status.READY) {
    await Bot.destroy();
  }

  let { Discord: DiscordConfig } = await Configuration;
  let { TOKEN } = DiscordConfig;

  let fileHound = FileHound.create()
    .path(Path.resolve(__dirname, "listeners"))
    .match("*.listener.js");

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