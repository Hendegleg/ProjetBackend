const User = require('../models/utilisateurs');


const 
    getProfileAndStatusHistory= async (req, res) => {
      try {
        const {
          statusHistory,
          dateEntreeChoeur, 
          dateSortieChoeur,
          concertsValidated ,
          repetitionsValidated ,

        }=req.body;
        const userId = req.params.id; 
        
        
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }
  
       
        //const statusHistory = user.statusHistory || [];
  
        
        let currentStatus = 'Inactif'; 
  
        if (statusHistory.length === 0) {
          currentStatus = 'Choriste Junior'; 
        } else {
          
          
  
          
          const firstSeasonYear = statusHistory[0].season;
  
        
          const currentYear = new Date().getFullYear();
  
         
          const yearsOfMembership = currentYear - firstSeasonYear + 1;
  
          if (yearsOfMembership === 1) {
            currentStatus = 'Choriste'; // Devient choriste la saison d'après la première
          } else if (yearsOfMembership === 3 && (concertsValidated >= 10 || repetitionsValidated >= 20)) {
            currentStatus = 'Choriste Senior'; // Devient choriste senior après 3 ans et conditions validées
          } else if (firstSeasonYear === 2018) {
            currentStatus = 'Veteran'; // Fait partie de la première promo
          }
        }
  
        
        res.status(200).json({ success: true, data: { profile: user.toPublic(), statusHistory, currentStatus } });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    };
  

  module.exports = {
    getProfileAndStatusHistory};