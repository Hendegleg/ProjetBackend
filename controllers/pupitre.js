const Pupitre = require("../models/pupitre");
const User=require("../models/utilisateurs")

const assignLeadersToPupitre = async (req, res) => {
    const { chefsIds } = req.body;
    const pupitreId = req.params.pupitreId;

    try {
        console.log(req.body);
        const pupitre = await Pupitre.findById(pupitreId);

        if (!pupitre) {
            return res.status(404).json({ error: 'Pupitre non trouvé' });
        }

        
        pupitre.chefs = chefsIds;
        if (!Array.isArray(chefsIds)) {
            return res.status(400).json({ error: 'leaderIds n\'est pas un tableau valide' });
        } 

        for (const chefIds of chefsIds) {
            const user = await User.findById(chefIds);
            if (user) {
                user.role = 'chef de pupitre'; // Mettre à jour le rôle
                await user.save(); // Sauvegarder les modifications dans la base de données
            }
        }
        await pupitre.save();

        res.status(200).json({ message: 'les chefs assignés avec succes' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    assignLeadersToPupitre,
};