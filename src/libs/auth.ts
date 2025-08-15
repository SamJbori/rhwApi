import { env } from "./env";

/**
 * **Placeholder** for authentication logic
 * @param token 
 * @returns 
 */
export const authenticate = (token: string) => env.AUTH_TOKEN === token;
