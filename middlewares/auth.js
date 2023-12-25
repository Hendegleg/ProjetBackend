const jwt = require('jsonwebtoken');
const User = require('../controllers/utilisateur'); 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const user = await User.findById(userId); 

    if (user) {
      req.auth = {
        userId: userId,
        role: user.role,
      };
      next();
    } else {
      res.status(401).json({ error: "L'utilisateur n'existe pas" });
    }
  } catch (error) {
    res.status(401).json({ error: "Erreur de token" });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.auth.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Pas d'accès à cette route" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const isChoriste = (req, res, next) => {
  try {
    if (req.auth.role === 'choriste') {
      next();
    } else {
      res.status(403).json({ error: "Tu ne peux pas accéder à cette route" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const ischefpupitre = (req, res, next) => {
  try {
    if (req.auth.role === 'chef de pupitre') {
      next();
    } else {
      res.status(403).json({ error: "Tu ne peux pas accéder à cette route" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const ismanagerChoeur = (req, res, next) => {
  try {
    if (req.auth.role === 'manager de choeur') {
      next();
    } else {
      res.status(403).json({ error: "Tu ne peux pas accéder à cette route" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


module.exports={
  authMiddleware,
  isAdmin,
  isChoriste,
  ischefpupitre ,
  ismanagerChoeur


}