import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT ?? "5000",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? "http://localhost:8081",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
};

for (const [name, value] of Object.entries(env)) {
  if (!value) {
    throw new Error(`${name} is required!!`);
  }
}
