const User = require('../models/utilisateurs');
exports.updateTessiture = (req, res) => {
    const { userId, nouvelleTessiture } = req.body;
  
    User.findById(userId)
      .then((utilisateur) => {
        if (utilisateur && utilisateur.role === 'choriste') {
          utilisateur.tessiture = nouvelleTessiture;
          return utilisateur.save();
        } else if (!utilisateur) {
          res.status(404).json({
            message: "Utilisateur non trouvé",
          });
        } else {
          res.status(403).json({
            message: "L'utilisateur n'a pas le rôle de choriste",
          });
        }
      })
      .then((utilisateurModifie) => {
        if (utilisateurModifie) {
          res.status(200).json({
            utilisateur: utilisateurModifie,
            message: "Tessiture mise à jour avec succès",
          });
        }
      })
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Échec de la mise à jour de la tessiture",
        });
      });
  };
  