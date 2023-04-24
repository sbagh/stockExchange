"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysecretKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
// generate secret key using randomBytes
const generateSecretKey = () => {
    return crypto_1.default.randomBytes(64).toString("hex");
};
// generate a secret key and assign to a variable
const mysecretKey = generateSecretKey();
exports.mysecretKey = mysecretKey;
//# sourceMappingURL=config.js.map