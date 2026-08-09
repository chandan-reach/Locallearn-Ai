import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'locallearn_secret_key_2026_jwt_token',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
