const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("Test auth");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN");
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User Id non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: error | "Unauthorized request" });
  }
};
