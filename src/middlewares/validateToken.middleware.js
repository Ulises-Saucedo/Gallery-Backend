import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        if (!token)
            return res.status(400).json({ message: "token doesnt exists" });

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        req.uid = uid;

        next();
    } catch (e) {
        return res.status(401).json({ message: e.message });
    }
};
