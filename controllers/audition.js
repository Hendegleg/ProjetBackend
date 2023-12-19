const Audition = require('../models/audition');

exports.createAudition = async (req, res) => {
    try {
      const {
        DateAudition,
        nombre_séance,
        dureeAudition,
        candidat,
        extraitChante,
        tessiture,
        evaluation,
        decisioneventuelle,
        remarque
      } = req.body;
      const nouvelleAudition = new Audition({
        DateAudition,
        nombre_séance,
        dureeAudition,
        candidat,
        extraitChante,
        tessiture,
        evaluation,
        decisioneventuelle,
        remarque
      });
      const auditionEnregistree = await nouvelleAudition.save();
      res.status(201).json(auditionEnregistree);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Lire les informations d'une audition spécifique par son ID
exports.getAuditionById = async (req, res) => {
    try {
      const audition = await Audition.findById(req.params.id).populate('candidat');
      res.json(audition);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // Mettre à jour les détails d'une audition spécifique par son ID
exports.updateAudition = async (req, res) => {
    try {
      const audition = await Audition.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(audition);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Supprimer une audition spécifique par son ID
exports.deleteAudition = async (req, res) => {
    try {
      await Audition.findByIdAndDelete(req.params.id);
      res.json({ message: 'Audition supprimée' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  // tache b 
  async function genererPlanification(req, res) {
    try {
      const auditionId = req.body.auditionId;
      const auditionSaison = await Audition.findOne({ _id: auditionId });
  
      if (!auditionSaison) {
        throw new Error("Audition non trouvée");
      }
  
      const candidats = await Candidat.find({
        decision: "pas encore",
        date_audition: { $exists: false },
      });
      const nombreSeancesParJour = auditionSaison.nombreSeancesParJour;
      const dureeAuditionMinutes = auditionSaison.dureeAudition;
      const nombreTotalSeances = Math.ceil(
        candidats.length / nombreSeancesParJour
      );
  
      const planning = [];
  
      let dateDebutAudition = moment(auditionSaison.dateDebut)
        .hours(auditionSaison.heureDebutAudition)
        .minutes(0)
        .seconds(0)
        .milliseconds(0);
  
      for (let seance = 0; seance < nombreTotalSeances; seance++) {
        for (
          let seanceJour = 0;
          seanceJour < nombreSeancesParJour;
          seanceJour++
        ) {
          const candidatIndex = seance * nombreSeancesParJour + seanceJour;
  
          if (candidatIndex < candidats.length) {
            const candidat = candidats[candidatIndex];
  
            if (candidat.date_audition) {
              continue;
            }
  
            const dateFinAudition = dateDebutAudition
              .clone()
              .add(dureeAuditionMinutes, "minutes");
  
            if (dateFinAudition.isAfter(auditionSaison.dateFin)) {
              console.warn(
                "La date de fin de l'audition dépasse la date spécifiée."
              );
              res.status(400).json({
                success: false,
                error: "La date de fin de l'audition dépasse la date spécifiée.",
              });
              return;
            }
  
            candidat.heure_debut_audition = dateDebutAudition.toDate();
            candidat.heure_fin_audition = dateFinAudition.toDate();
            candidat.date_audition = dateDebutAudition.toDate();
            candidat.audition = auditionSaison._id;
  
            await candidat.save();
            // await envoyerEmail(
            //   candidat,
            //   moment(dateDebutAudition),
            //   moment(dateFinAudition)
            // );
  
            planning.push({
              nom: candidat.nom,
              prenom: candidat.prenom,
              date_audition: dateDebutAudition.format("DD/MM/YYYY"),
              heure_debut_audition: dateDebutAudition.format("HH:mm"),
              heure_fin_audition: dateFinAudition.format("HH:mm"),
            });
  
            dateDebutAudition.add(dureeAuditionMinutes, "minutes");
          }
        }
  
        dateDebutAudition = moment(auditionSaison.dateDebut)
          .add(seance + 1, "days")
          .hours(auditionSaison.heureDebutAudition)
          .minutes(0)
          .seconds(0)
          .milliseconds(0);
      }
  
      console.log("Planification des auditions générée avec succès");
      res.status(200).json({ success: true, data: planning });
    } catch (error) {
      console.error(
        "Erreur lors de la génération de la planification des auditions:",
        error.message
      );
      res.status(500).json({ success: false, error: error.message });
    }
  }

  module.exports = {
    genererPlanification,
  };