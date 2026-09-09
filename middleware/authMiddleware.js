import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized. Please login"
            })
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid or expired token"
        })
    }
}