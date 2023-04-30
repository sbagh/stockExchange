//typescript interfaces in user accounts microservices

interface UserLoginCredentials {
   username: string;
   password: string;
}

interface UserSignupCredentials {
   username: string;
   password: string;
   firstName: string;
   lastName: string;
}

interface User {
   userID: number;
   username?: string;
   password?: string;
   firstName?: string;
   lastName?: string;
}

export { UserLoginCredentials, UserSignupCredentials, User };
