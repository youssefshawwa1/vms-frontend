import db from "../config/db.js";

const AuthModel = {
  // Changed 'code' to 'otpCode' to match your controller call
  storeVerificationCode: async ({ userId, otpCode, expiresAt }) => {
    const query = `
      INSERT INTO verification_codes (userId, code, expiresAt) 
      VALUES (?, ?, ?)
    `;
    return await db.execute(query, [userId, otpCode, expiresAt]);
  },

  verifyCode: async (userId, code) => {
    const query = `
      SELECT * FROM verification_codes 
      WHERE userId = ? AND code = ? AND expiresAt > NOW() 
      ORDER BY createdAt DESC LIMIT 1
    `;
    const [rows] = await db.execute(query, [userId, code]);
    return rows[0];
  },
  consumeCode: async (userId) => {
    return await db.execute("DELETE FROM verification_codes WHERE userId = ?", [
      userId,
    ]);
  },
};

export default AuthModel;
