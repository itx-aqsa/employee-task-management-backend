import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                status: false,
                message: "Authorization token is required"
            })
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
            return res.status(401).json({
                status: false,
                message: "Token is missing"
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