import * as dotenv from 'dotenv'

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

const env = {
    development: process.env.NODE_ENV === 'development',
    test: process.env.NODE_ENV === 'test',
    staging: process.env.NODE_ENV === 'staging',
    production: process.env.NODE_ENV === 'production',
};

export { port, env };