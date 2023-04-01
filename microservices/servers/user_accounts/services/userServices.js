const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../database/dbQueries.js");
const { mysecretKey } = require("../config.js");

// create a user
const createUser = async (username, password, firstName, lastName) => {
   try {
      // hash password
      const hashedPassword = await argon2.hash(password);
      // save user to db
      await db.createUser(username, hashedPassword, firstName, lastName);
      const userID = await db.getUserID(username);
      // create token
      const token = jwt.sign({ userID }, mysecretKey);
      // return user and token
      return { userID, token };
   } catch (error) {
      console.log("error in createing user at userClass", error);
      throw error;
   }
};

// get all users
const getAllUsers = async (req, res) => {
   try {
      // query db for all users
      const users = await db.getAllUsers();
      // return users
      return users;
   } catch (error) {
      console.log("error in getting all users", error);
      throw error;
   }
};

module.exports = {
   createUser,
   getAllUsers,
};
