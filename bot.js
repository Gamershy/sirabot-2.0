const Commands = require("./commands");
const Initializers = require("./app/initializers");
const Listeners = require("./app/listen");

Initializers
  .then(Commands.loader)
  .then(Listeners.listen)
  .catch(error => {
    console.error(error.stack);
    process.exit(1);
  });
