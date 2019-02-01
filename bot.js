const Commands = require("./commands");
const Initialisers = require("./app/initialisers");
const Listeners = require("./app/listen");

Initialisers
  .then(Commands.loader)
  .then(Listeners.listen)
  .catch(error => {
    console.error(error.stack);
    process.exit(1);
  });
