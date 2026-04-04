import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    console.log(`Error in auth middleware: ${error}`);

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
};