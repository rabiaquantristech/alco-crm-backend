// middleware/accessMiddleware.js

const { checkUserAccess } = require("../utils/accessEngine.js");

exports.verifyAccess = (enrollmentId) => {
  return async (req, res, next) => {
    const result = await checkUserAccess(req.user.id, enrollmentId);

    if (!result.access) {
      return res.status(403).json({
        success: false,
        message: result.reason,
      });
    }

    next();
  };
};