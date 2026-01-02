import db from "../config/db.js";
//this model is the Auth model, which store the verificaction code, and verify, and consume the codde.
const AuthModel = {
  //creating or storing a new code
  storeVerificationCode: async ({ userId, otpCode, expiresAt }) => {
    const query = `
      INSERT INTO verification_codes (userId, code, expiresAt) 
      VALUES (?, ?, ?)
    `;
    return await db.execute(query, [userId, otpCode, expiresAt]);
  },

  verifyCode: async (userId, code) => {
    //verify if tthe code is valid. not expired.
    const query = `
      SELECT * FROM verification_codes 
      WHERE userId = ? AND code = ? AND expiresAt > NOW() 
      ORDER BY createdAt DESC LIMIT 1
    `;
    const [rows] = await db.execute(query, [userId, code]);
    return rows[0];
  },
  consumeCode: async (userId) => {
    //if the user logeed, all the codes of that user will be removed.
    return await db.execute("DELETE FROM verification_codes WHERE userId = ?", [
      userId,
    ]);
  },
};

export default AuthModel;
