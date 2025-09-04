const validateRequest = (schema) => (req, res, next) => {
    console.log("VALIDATION: Request received", req.method, req.path);
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        console.log("VALIDATION: Schema validation passed");
        next();
    } catch (error) {
        console.log("VALIDATION: Schema validation failed", error.errors);
        const formattedErrors = error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
        }));

        return res.status(400).json({
            error: "Validation error",
            detail: formattedErrors
        });
    }
}

module.exports = {
    validateRequest
};
