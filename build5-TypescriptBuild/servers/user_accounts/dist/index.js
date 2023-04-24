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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userService = __importStar(require("./services/userServices.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
const userAccountsPORT = 4000;
// get all users
app.get("/getAllUsers", async (req, res) => {
    const users = await userService.getAllUsers();
    // console.log(users);
    res.send(users);
});
// authenticate and login a user
app.post("/login", async (req, res) => {
    //1- desctructure username and password from req.body
    const { username, password } = req.body;
    //2- get login reponse from user service
    const loginRepsonse = await userService.loginUser(username, password);
    //3- send back login success (userid, token) or fail
    res.json(loginRepsonse);
    // test if neccessary:
    // if (loginRepsonse) {
    //    res.json(loginRepsonse);
    // } else {
    //    res.status(400).json(loginRepsonse);
    // }
});
// create a user
app.post("/signup", async (req, res) => {
    //1- destructure username and password from req.body
    const { username, password, firstName, lastName } = req.body;
    console.log(username, password, firstName, lastName);
    //2- create user using UserService
    const signupResponse = await userService.createUser(username, password, firstName, lastName);
    //3- send response: {userID:, token:, success: true, message:"" } or {success: false, message:""}
    res.json(signupResponse);
});
app.listen(userAccountsPORT, () => console.log("user accounts microservice running on port  ", userAccountsPORT));
//# sourceMappingURL=index.js.map