const crypto = require("crypto");

// generate secret key using randomBytes
const generateSecretKey = () => {
   return crypto.randomBytes(64).toString("hex");
};
// generate a secret key and assign to a variable
const mysecretKey = generateSecretKey();

module.exports = { mysecretKey };
