export const roleMiddleware = (allowedRole) => {
    return (req, res, next) => {

        if(req.user.role !== allowedRole) {
            return res.status(403).json({
                status: false,
                message: "You are not allowed to access this resource"
            })
        }
        next();
    }
}