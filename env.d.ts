declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    // Add all your env variables here
  }
}
