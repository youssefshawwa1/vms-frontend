import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });

  try {
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified; // This contains the userId and role from the token
    next(); // Move to the next function
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // We get req.user from the authenticateToken middleware above
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: You do not have the required role (${allowedRoles.join(
          " or "
        )})`,
      });
    }
    next();
  };
};
