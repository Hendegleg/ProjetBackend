const Concert = require('../models/concert'); 
const Utilisateur= require('../models/utilisateurs');
const Placement= require('../models/placement');
exports.savePlacementForConcert = async (req, res) => {
    try {
      const { concertId, placementDetails } = req.body;
      
      // Vérifier si un placement existe déjà pour ce concert
      const existingPlacement = await Placement.findOne({ concertId });
  
      if (existingPlacement) {
        // Si un placement existe, le mettre à jour
        existingPlacement.placementDetails = placementDetails;
        await existingPlacement.save();
        res.status(200).json({ message: 'Placement mis à jour avec succès.', placement: existingPlacement });
      } else {
        // S'il n'existe pas, créer un nouveau placement pour ce concert
        const newPlacement = new Placement({ concertId, placementDetails });
        await newPlacement.save();
        res.status(201).json({ message: 'Placement enregistré avec succès.', placement: newPlacement });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getPlacementForConcert = async (req, res) => {
    try {
      const concertId = req.params.concertId;
      const placement = await Placement.findOne({ concertId });
  
      if (!placement) {
        return res.status(404).json({ message: 'Aucun placement trouvé pour ce concert.' });
      }
  
      res.status(200).json({ placement });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
exports.proposePlacementBySize = async (concertId) => {
    try {
        // Récupérer les participants pour le concert spécifié
        const participants = await User.find({ concertId });

        // Trier les participants par taille, du plus court au plus long
        const sortedParticipants = participants.sort((a, b) => {
            // Supposons que la taille des participants est stockée dans une propriété "taille_en_m"
            const tailleParticipantA = parseFloat(a.taille_en_m);
            const tailleParticipantB = parseFloat(b.taille_en_m);

            return tailleParticipantA - tailleParticipantB;
        });

        // Générer une proposition de placement en fonction de la taille des participants triés
        const placementProposal = [];
        let indexCourt = 0;
        let indexLong = sortedParticipants.length - 1;

        while (indexCourt <= indexLong) {
            // Placer les participants les plus courts à l'avant et les plus longs à l'arrière
            placementProposal.push({
                participant: sortedParticipants[indexCourt].name,
                position: indexCourt === indexLong ? 'Arrière' : 'Avant'
            });

            indexCourt++;
            if (indexCourt < indexLong) {
                placementProposal.push({
                    participant: sortedParticipants[indexLong].name,
                    position: 'Arrière'
                });
                indexLong--;
            }
        }

        const placement = await Placement.findOne({ concertId });

        if (placement) {
            // Si un placement existe déjà pour ce concert, mettez à jour les détails
            placement.placementDetails = placementProposal;
            await placement.save();
        } else {
            // S'il n'existe pas, créez un nouveau placement pour ce concert avec les détails générés
            const newPlacement = new Placement({ concertId, placementDetails: placementProposal });
            await newPlacement.save();
        }


        // Retourner la proposition de placement
        return placementProposal;
    } catch (error) {
        // Gérer les erreurs
        throw new Error('Erreur lors de la proposition et sauvegarde des détails de placement.');
    }
};
