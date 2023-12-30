const jwt = require('jsonwebtoken');
const User = require ("../controllers/auth")
const luser = require ("../models/utilisateurs")

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Token non fourni" });
    }

    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const user = await luser.findById(userId);
    if (user) {
      req.auth = {
        userId: userId,
        role: user.role,
      };
      next();
    } else {
      return res.status(401).json({ error: "L'utilisateur n'existe pas" });
    }
  } catch (error) {
    console.error(error); 
    return res.status(401).json({ error: "Erreur de token: " + error.message });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (allowedRoles.includes(req.auth.role)) {
        next();
      } else {
        return res.status(403).json({ error: "Accès non autorisé à cette route" });
      }
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
};

module.exports.isAdmin = checkRole(['admin']);
module.exports.isChoriste = checkRole(['choriste']);
module.exports.ischefpupitre = checkRole(['chef de pupitre']);
module.exports.ismanagerChoeur = checkRole(['manager de choeur']);
