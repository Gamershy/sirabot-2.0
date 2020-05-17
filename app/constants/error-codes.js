// Create a truly empty object that has no properties already attached
const ErrorCodes = Object.create(null);

// Set error codes
ErrorCodes.COMMAND_CONFLICT = "COMMAND_CONFLICT";

// Freeze the configuration object and export it
module.exports = Object.freeze(ErrorCodes);
