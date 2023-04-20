interface User {
    userID: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}
declare const getAllUsers: () => Promise<User[]>;
declare const createUser: (username: any, password: any, firstName: any, lastName: any) => Promise<void>;
declare const getUserByUsername: (username: string) => Promise<User | null>;
export { User, getAllUsers, createUser, getUserByUsername };
