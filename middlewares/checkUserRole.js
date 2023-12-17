
const user=require("../models/utilisateur")



const checkUserRole = (req, res, next) => {
    const userRole = req.user.role; 
    
    if (userRole === 'choriste' || userRole === 'admin') {
      return next(); 
    }
  
    return res.status(403).json({ success: false, message: 'Accès non autorisé.' });
  };
  
  module.exports = checkUserRole;