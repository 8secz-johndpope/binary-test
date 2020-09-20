/**
 * @author Shuja Ahmed
 * @email shujahm@gmail.com
 * @create date 2020-09-18 00:48:02
 * @modify date 2020-09-18 00:48:02
 * @desc this acts as a simple user controller to provide user login API
 */
import { TokenService } from '@loopback/authentication';
import { Credentials, MyUserService, User, UserRepository } from '@loopback/authentication-jwt';
import { UserProfile } from '@loopback/security';
export declare class NewUserRequest extends User {
    password: string;
}
export declare const CredentialsRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                    };
                };
            };
        };
    };
};
export declare class UserController {
    jwtService: TokenService;
    userService: MyUserService;
    user: UserProfile;
    protected userRepository: UserRepository;
    constructor(jwtService: TokenService, userService: MyUserService, user: UserProfile, userRepository: UserRepository);
    /**
     * the following method is used to login user with given credentials
     * @param credentials
     */
    login(credentials: Credentials): Promise<{
        user: object;
        token: string;
    }>;
    whoAmI(currentUserProfile: UserProfile): Promise<string>;
    /**
     * the following method defines the user sign up API
     * @param newUserRequest
     */
    signUp(newUserRequest: NewUserRequest): Promise<User>;
}
