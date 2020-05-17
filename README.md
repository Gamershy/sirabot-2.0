# sirabot-2.0
A full rewrite of the `Anything NSFW` Discord server bot "Sirabot"

## Folder Structure
The folder structure used by Sirabot is rather simple. The final structure
that I have chosen to implement is a mix of different structures that I have
seen in web server frameworks and other Discord bots over the course of my
time as a backend developer.

The application is structured as follows:

### The root directory: `/`
The root directory will contain only package and Git specific documents such
as `package.json` and `.gitignore`, as well as the main entry point for the
program. Everything else will be located in a subfolder under this directory
to make it easier to find and modify parts of the application.

### Application data: `/app`
The application data will contain all the bot's configuration and initializer
files. These files contain the initial setup that the bot will go through every
time it is started up, and the configuration that will be used for setting up
the bot's application data.

- `/config` - The configuration data used during initial start-up and during
  the bot's life. Can be reloaded by anyone with a high enough permission
  level using the command `/reload-config`.
- `/initializers` - All files placed in here will be loaded in alphabetical
  order. These files will each export a promise that will be evaluated, with
  the bot itself only being allowed to start once all of them have finished.
  The best way to create a promise is by defining and running an
  [asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

### Command data: `/commands`
The command data directory will contain a list of subdirectories, each one
named after the category its contents will be placed into in the command list.
Command files placed in these subfolders will follow the naming convention of

```
<commandName>.command.js
```

and will ideally export an object with the following signature:
- main: `AsyncFunction(Discord.Message, string[]) => boolean|Error`
- permission: `number?`
- documentation: `Object?`
  - description: `string`
  - syntax: `string`
- aliases: `string[]?`
- enabled: `boolean?`

Each command will be named based on the first portion of its filename, with
the command name being transformed from camelCase (`commandName`) to
snake-case (`command-name`) when being read into the bot's command registry.
Commands will be managed using `/manage-command`, with command names being
provided in their snake-case form when referenced in the command.

`main` specifies the function that is executed when the command is called. It is
given the message that triggered the command, as well as an array that contains
the message contents split by the U+0020 SPACE character ("` `"). This function
should return a boolean value, or an instance of the `Error` class - or any
subclass thereof. It **should never** `throw` an error as this will trigger a
Promise rejection, which are handled differently to the function exiting
normally.

`permission` determines what permission level is required to execute a
command. If not provided it will default to `1`, meaning everyone can execute
it.

`aliases` is an array of strings in `commandName` format. If provided, the bot
will parse these extra names and register the command to them, following the
above name conversion rules.

If `enabled` is provided it will determine whether the bot will read the
command into memory: `true` make the bot load it, and `false` will not. The
field will default to `false` when not provided.
