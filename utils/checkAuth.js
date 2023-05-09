import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Not a found token",
      });
    }
  } else {
    return res.status(403).json({
      message: "Not a found",
    });
  }
};
