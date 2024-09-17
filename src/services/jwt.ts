import JWT from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JWTUser } from '../interfaces';
import * as dotenv from 'dotenv'
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload:JWTUser = {
            id: user?.id,
            email: user?.email
        };
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }

    public static decodeToken(token: string){
        try {
            return JWT.verify(token, JWT_SECRET) as JWTUser;    
        } catch (error) {
            return null;
        }
        
    }
}

export default JWTService;