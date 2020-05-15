const FileHound = require("filehound");
const Permissions = require("../app/config/permissions");
const path = require("path");

const {
  slug: toSlug
} = require("to-case");

const commands = new Map();

async function loader() {
  commands.clear();

  let fileHound = FileHound.create();

  // Use a promise to allow us to ensure all commands are loaded before starting
  // the bot.
  let promise = new Promise((resolve, reject) => {
    console.group("Loading commands...");

    fileHound.on("match", function(file) {
      let data = require(file);
      let category = path.basename(path.dirname(file));
      let names = [path.basename(file, ".command.js")];

      if (typeof data.main !== "function") {
        console.error(`No primary function exported for command ${names[0]}. Aborting function load.`);
        return;
      }

      if (!"permission" in data || !(Number.isSafeInteger(+data.permission) && +data.permission > 0)) {
        data.permission = Permissions.USER;
      }

      if ("documentation" in data) {
        if (typeof data.documentation !== "object" || data.documentation === null) {
          delete data.documentation;
        }

        else if (typeof data.documentation.description !== "string" || typeof data.documentation.syntax !== "string") {
          console.error(`Invalid documentation object exported for command ${names[0]}. Removing documentation.`);
          delete data.documentation;
        }
      }

      if ("aliases" in data) {
        if (Array.isArray(data.aliases)) {
          // Only register strings as acceptable command aliases
          names = names.concat(data.aliases.filter(name => typeof name === "string"));
        }

        // In the unlikely event that the alias list is a string, register it as a single alias
        else if (typeof data.aliases === "string") {
          names.push(data.aliases);
        }
      }

      // Finally, ensure that all names are only encountered once
      // Also, transform them to their slug-case names
      names = Array.from(new Set(names), name => toSlug(name));

      // If this command is not marked as enabled, don't load it into memory.
      if (!data.enabled) {
        console.log(`Skipping disabled command "${category}/${names[0]}"`);

        return;
      }

      for (let name of names) {
        let docs = "documentation" in data? data.documentation : {
          description: "Not yet documented. Please ask either Zuris or Gamer_Shy to write documentation for this command.",
          syntax: `/${name}`
        };

        if (commands.has(name)) {
          commands.set(name, {error: "COMMAND_CONFLICT"}); // TODO: Replace with Errors.COMMAND_CONFLICT later
        } else {
          let command = {
            main: data.main,
            permission: data.permission,
            documentation: docs,
            aliases: names.slice(1),
            isAlias: name !== names[0],
            aliasOf: names[0],
            category
          };

          commands.set(name, command);
        }
      }

      console.log(`Loaded command "${category}/${names[0]}"`);

      if (names.length > 1) {
        console.log(`  with alias(es) "${names.slice(1).join('", "')}"`);
      }
    });

    fileHound.on("end", function() {
      console.groupEnd(); // Loading commands...

      // Resolve with the full set of loaded commands
      resolve(commands);
    });

    fileHound.on("error", reject);
  });

  fileHound.path(__dirname);
  fileHound.match("*.command.js");
  fileHound.depth(1);

  // noinspection JSIgnoredPromiseFromCall
  fileHound.find();

  return promise;
}

async function loadSingle(command) {
  // TODO: Write code for loading/reloading a command.
}

module.exports = commands;
module.exports.loader = loader;
module.exports.loadSingle = loadSingle;
