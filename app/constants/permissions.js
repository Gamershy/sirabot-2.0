// Create a truly empty object that has no properties already attached
const Permissions = Object.create(null);

// Set permission data
Permissions.USER = 0b1;

// Freeze the configuration object and export it
module.exports = Object.freeze(Permissions);
