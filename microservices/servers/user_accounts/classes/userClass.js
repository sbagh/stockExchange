const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../database/dbQueries.js");
const { secretKey } = require("../config.js");

class UsersClass {
   constructor() {}

   async createUser(username, password, firstName, lastName) {
      try {
         // hash password
         const hashedPassword = await argon2.hash(password);
         // save user to db
         await db.createUser(username, hashedPassword, firstName, lastName);
         const userID = await db.getUserID(username);
         // create token
         const token = jwt.sign({ userID }, secretKey);
         // return user and token
         return { userID, token };
      } catch (error) {
         console.log("error in createing user at userClass", error);
         throw error;
      }
   }
}

module.exports = {
   UsersClass,
};
