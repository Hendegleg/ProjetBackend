const Pupitre = require("../models/pupitre");

const assignLeadersToPupitre = async (req, res) => {
    const { leaderIds } = req.body;
    const pupitreId = req.params.pupitreId;

    try {
        
        const pupitre = await Pupitre.findById(pupitreId);

        if (!pupitre) {
            return res.status(404).json({ error: 'Pupitre non trouvé' });
        }

        
        pupitre.leaders = leaderIds; 

        
        await pupitre.save();

        res.status(200).json({ message: 'les chefs assignés avec succes' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    assignLeadersToPupitre,
};