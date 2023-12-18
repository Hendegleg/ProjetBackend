const User = require('../models/utilisateurs');

const 
    getProfileAndStatusHistory= async (req, res) => {
      try {
        const userId = req.params.id; // ID de l'utilisateur à consulter
        
        // Recherche l'utilisateur dans la base de données
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }
  
        // Obtient l'historique des statuts
        const statusHistory = user.statusHistory || [];
  
        // Détermine le statut actuel en fonction des règles spécifiques
        let currentStatus = 'Inactif'; // Par défaut, statut inactif si aucun historique
  
        if (statusHistory.length === 0) {
          currentStatus = 'Choriste Junior'; // Premier statut pour la première saison
        } else {
          // Vérifie si l'utilisateur a validé un certain nombre de répétitions ou de concerts
          const concertsValidated = user.concertsValidated || 0;
          const repetitionsValidated = user.repetitionsValidated || 0;
  
          // Obtient l'année de la première saison
          const firstSeasonYear = statusHistory[0].season;
  
          // Année actuelle
          const currentYear = new Date().getFullYear();
  
          // Calcul de l'année d'adhésion de l'utilisateur
          const yearsOfMembership = currentYear - firstSeasonYear + 1;
  
          if (yearsOfMembership === 1) {
            currentStatus = 'Choriste'; // Devient choriste la saison d'après la première
          } else if (yearsOfMembership === 3 && (concertsValidated >= 10 || repetitionsValidated >= 20)) {
            currentStatus = 'Choriste Senior'; // Devient choriste senior après 3 ans et conditions validées
          } else if (firstSeasonYear === 2018) {
            currentStatus = 'Vétéran'; // Fait partie de la première promo
          }
        }
  
        // Retourne tous les détails du profil (sauf le mot de passe), l'historique du statut et le statut actuel
        res.status(200).json({ success: true, data: { profile: user.toPublic(), statusHistory, currentStatus } });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    };
  

  module.exports = {
    getProfileAndStatusHistory};