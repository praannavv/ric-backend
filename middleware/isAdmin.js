export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    console.log("Admin here");
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
};
