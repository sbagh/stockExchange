const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../database/dbQueries.js");
const { mysecretKey } = require("../config.js");

//get user by username
const getUserByUsername = async (username) => {
   return (user = await db.getUserByUsername(username));
};

// authenticate and login user
const loginUser = async (username, password) => {
   //1- retrieve user from db
   const user = await getUserByUsername(username);
   // console.log(user);
   //2- validate if user exists
   if (!user)
      return { success: false, message: "Invalid username of password" };
   //3- validate password
   const isPasswordValid = await argon2.verify(user.password, password);
   // console.log(passwordValid);
   if (!isPasswordValid)
      return { success: false, message: "Invalid username of password" };
   //4- create token
   const token = await jwt.sign({ userID: user.userID }, mysecretKey);
   //5- return signed token with userID
   return { userID: user.userID, token, success: true };
};
// create a user
const createUser = async (username, password, firstName, lastName) => {
   try {
      // hash password
      const hashedPassword = await argon2.hash(password);
      // save user to db
      await db.createUser(username, hashedPassword, firstName, lastName);
      // get userID
      const user = await getUserByUsername(username);
      const userID = user.userID;
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
   loginUser,
};
