export const validateSchema = (schema) => (req, res, next) => {
    try {
        if (req.file) {
            const body = { postImage: req.file, title: req.body.title };
            schema.parse(body);
        } else {
            schema.parse(req.body);
        }
        next();
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.errors.map((error) => error.message) });
    }
};
