"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.getAllUsers = exports.createUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = __importStar(require("../database/dbQueries.js"));
const config_1 = require("../config/config");
//get user by username
const getUserByUsername = async (username) => {
    const user = await db.getUserByUsername(username);
    return user;
};
// authenticate and login user
const loginUser = async (username, password) => {
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
    const isPasswordValid = await argon2_1.default.verify(user.password, password);
    // console.log(passwordValid);
    if (!isPasswordValid)
        return { success: false, message: "Invalid username of password" };
    //4- create token
    const token = await jsonwebtoken_1.default.sign({ userID: user.userID }, config_1.mysecretKey);
    //5- return signed token with userID
    return { userID: user.userID, token, success: true };
};
exports.loginUser = loginUser;
// create a user
const createUser = async (username, password, firstName, lastName) => {
    try {
        //1- hash password
        const hashedPassword = await argon2_1.default.hash(password);
        //2- save user to db
        await db.createUser(username, hashedPassword, firstName, lastName);
        //3- get userID
        const user = await getUserByUsername(username);
        if (!user) {
            return {
                success: false,
                message: "Invalid username or password",
            };
        }
        const userID = user.userID;
        //4- create token
        const token = jsonwebtoken_1.default.sign({ userID }, config_1.mysecretKey);
        //5- return user, token, and success, message
        return {
            userID,
            token,
            success: true,
            message: "sign up successful, now logging in..",
        };
    }
    catch (error) {
        console.log("error in createing user at userClass", error);
        throw error;
    }
};
exports.createUser = createUser;
// get all users
const getAllUsers = async () => {
    try {
        //1- query db for all users
        const users = await db.getAllUsers();
        if (!users) {
            return null;
        }
        //2- return users
        return users;
    }
    catch (error) {
        console.log("error in getting all users", error);
        throw error;
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=userServices.js.map