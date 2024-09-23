import jwt from "jsonwebtoken";
import conf from "../../conf/conf.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, conf.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: "strict",
    //secure: conf.NODE_ENV !== "development",
  });
};
