const crypto = require("crypto");

// generate secret key using randomBytes
const generateSecretKey = () => {
   return crypto.randomBytes(64).toString("hex");
};
// get secret key
const mysecretKey = generateSecretKey();

module.exports = { mysecretKey };
