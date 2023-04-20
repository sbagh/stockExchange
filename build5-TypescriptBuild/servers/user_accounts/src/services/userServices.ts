import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as db from "../database/dbQueries.js";
import { mysecretKey } from "../config/config";

// typescript interface for User
interface User {
   userID: number;
   username?: string;
   password?: string;
   firstName?: string;
   lastName?: string;
}

//get user by username
const getUserByUsername = async (username: string): Promise<User | null> => {
   const user = await db.getUserByUsername(username);
   return user;
};

// authenticate and login user
const loginUser = async (
   username: string,
   password: string
): Promise<{
   userID?: number;
   token?: string;
   success: boolean;
   message?: string;
} | null> => {
   //1- retrieve user from db
   const user = await getUserByUsername(username);
   // console.log(user);
   //2- validate if user exists
   if (!user)
      return { success: false, message: "Invalid username or password" };
   //3- check if password exists, then verify password
   if (!user.password) {
      return { success: false, message: "Invalid usenrame or password" };
   }
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
const createUser = async (
   username: string,
   password: string,
   firstName: string,
   lastName: string
): Promise<{
   userID?: number;
   token?: string;
   success: boolean;
   message?: string;
}> => {
   try {
      // hash password
      const hashedPassword = await argon2.hash(password);
      // save user to db
      await db.createUser(username, hashedPassword, firstName, lastName);
      // get userID
      const user = await getUserByUsername(username);
      if (!user) {
         return {
            success: false,
            message: "Invalid username or password",
         };
      }
      const userID = user.userID;
      // create token
      const token = jwt.sign({ userID }, mysecretKey);
      // return user, token, and success, message
      return {
         userID,
         token,
         success: true,
         message: "sign up successful, now logging in..",
      };
   } catch (error) {
      console.log("error in createing user at userClass", error);
      throw error;
   }
};

// get all users
const getAllUsers = async () => {
   try {
      // query db for all users
      const users = await db.getAllUsers();
      if (!users) {
         return null;
      }
      // return users
      return users;
   } catch (error) {
      console.log("error in getting all users", error);
      throw error;
   }
};

export { createUser, getAllUsers, loginUser };
