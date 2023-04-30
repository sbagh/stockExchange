import type { User } from "../interfaces/interfaces.js";
declare const loginUser: (username: string, password: string) => Promise<{
    userID?: number | undefined;
    token?: string | undefined;
    success: boolean;
    message?: string | undefined;
} | null>;
declare const createUser: (username: string, password: string, firstName: string, lastName: string) => Promise<{
    userID?: number;
    token?: string;
    success: boolean;
    message?: string;
}>;
declare const getAllUsers: () => Promise<User[] | null>;
export { createUser, getAllUsers, loginUser };
