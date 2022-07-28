import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const { verify } = jsonwebtoken

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    const accessToken = token.split(" ").pop()
    verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (error, body) => {
      if (error) {
        return res.status(403).json({ success: false, message: "Token is invalid!" })
      }
      next()
    })
  } else {
    return res.status(401).json({ success: false, message: "You are not authorized!" })
  }
}
