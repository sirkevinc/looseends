import * as dotenv from 'dotenv'

dotenv.config();

import * as jwt from "jsonwebtoken";

export const isTokenValid = (token: string): boolean => {
    try {
        const decoded = jwt.verify(token, "mysecret");
        return true;
    } catch(err) {
        return false;
    }
}

export default isTokenValid