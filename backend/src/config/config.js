import "dotenv/config";

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    DB_PORT: process.env.DB_PORT,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    service: process.env.EMAIL_SERVICE || "gmail",
  },
};

// CRITICAL: Check if the most important secrets are missing
const requiredSecrets = ["JWT_SECRET", "DB_PASSWORD", "EMAIL_PASS"];
requiredSecrets.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`FATAL ERROR: ${name} is not defined in .env file.`);
  }
});

export default config;
