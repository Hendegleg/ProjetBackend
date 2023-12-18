const user =require("../models/utilisateurs")


const checkUserRole = (req, res, next) => {
  
  const userRole = req.userRole;

  if (userRole === 'choriste' || userRole === 'admin') {
    return next(); 
  }

  return res.status(403).json({ success: false, message: 'Accès non autorisé.' });
};

module.exports = checkUserRole;