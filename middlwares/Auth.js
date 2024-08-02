import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader == null || authHeader === undefined) {
        return res.status(401).json({ success: false, message: "No Token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "UnAuthorized" });
        }

        req.user = user;
        next();
    });

}

export default auth;