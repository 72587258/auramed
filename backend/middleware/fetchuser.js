const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    // Header se token (VIP pass) nikalna
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Bhai pehle login karke valid token daal!" });
    }
    try {
        // Token ko check karna ki asli hai ya nakli
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).send({ error: "Token galat hai bhai!" });
    }
}

module.exports = fetchuser;