import type { User } from "../interfaces/interfaces.js";
declare const getAllUsers: () => Promise<User[]>;
declare const createUser: (username: any, password: any, firstName: any, lastName: any) => Promise<void>;
declare const getUserByUsername: (username: string) => Promise<User | null>;
export { getAllUsers, createUser, getUserByUsername };
