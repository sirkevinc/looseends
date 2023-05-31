import { builder } from "../lib/builder"
import { User } from "../graphql/models/User";

export class Token {
    token: string
    // user: typeof User
    constructor(token: string) {
        this.token = token;
        // this.user = user;
    }
}

export const AuthToken = builder.objectType(Token, {
    name: 'AuthToken',
    fields: (t) => ({
        token: t.exposeString("token"),
        // Add user data to payload?
    })
});