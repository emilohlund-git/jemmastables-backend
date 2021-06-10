declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    PORT: number;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    DATABASE: string;
    PG_CONSTRING: string;
  }
}
