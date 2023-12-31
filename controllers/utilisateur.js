const User = require('../models/utilisateurs');

const getProfileAndStatusHistory = async (req, res) => {
  try {
    const userId = req.params.id;


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }
    const statusHistory = user.statusHistory || [];


    let currentStatus = 'Inactif';

    if (statusHistory.length === 0) {
      currentStatus = 'Choriste Junior';
    } else {

      const concertsValidated = user.concertsValidated;
      const repetitionsValidated = user.repetitionsValidated;


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
}


const getUserActivityHistory = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    const saisonId = req.query.saison;
    const oeuvreId = req.query.oeuvre;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalRepetitions = user.Repetitions.length;
    const totalConcerts = user.Concerts.length;

    const repetitionsHistory = await Promise.all(
      user.Repetitions.map(async (repetition) => {
        const repetitionData = await Repetition.findById(repetition);
        return {
          date: repetitionData ? repetitionData.date : null,
          lieu: repetitionData ? repetitionData.lieu : null,
          programme: repetitionData ? repetitionData.programme : null,
        };
      })
    );

    const concerts = await Promise.all(
      user.Concerts.map(async (concert) => {
        const concertDetails = await Concert.findById(concert);
        if (!concertDetails) {
          return null;
        }

        if (saisonId && concertDetails.saison != saisonId) {
          return null;
        }

        if (oeuvreId && !concertDetails.programme.includes(oeuvreId)) {
          return null;
        }

        const oeuvres = await Promise.all(
          concertDetails.programme.map(async (oeuvre) => {
            const oeuvreData = await Oeuvre.findById(oeuvre);
            return {
              title: oeuvreData ? oeuvreData.titre : "Unknown Title",
            };
          })
        );

        const saisonData = await Saison.findById(concertDetails.saison);
        const saisonName = saisonData ? saisonData.nom : "Unknown Season";

        return {
          nom: concertDetails.nom,
          date: concertDetails.date,
          lieu: concertDetails.lieu,
          saison: saisonName,
          ouevres,
        };
      })
    );

    const filteredConcerts = concerts.filter((concert) => concert !== null);

    const activityHistory = {
      totalRepetitions,
      totalConcerts,
      repetitionsHistory,
      concerts: filteredConcerts,
    };

    res.json({ activityHistory });
  } catch (error) {
    console.error("Error fetching user activity history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUserActivityHistory = async (req, res) => {
  try {
    const userIdFilter = req.query.id;
    const saisonId = req.query.saison;
    const oeuvreId = req.query.oeuvre;

    const users = userIdFilter
      ? [await User.findById(userIdFilter)]
      : await User.find();

    const activityHistories = await Promise.all(
      users.map(async (user) => {
        if (!user) {
          return null; // User not found
        }

        const totalRepetitions = user.Repetitions.length;
        const totalConcerts = user.Concerts.length;

        const repetitionsHistory = await Promise.all(
          user.Repetitions.map(async (repetition) => {
            const repetitionData = await Repetition.findById(repetition);
            return {
              date: repetitionData ? repetitionData.date : null,
              lieu: repetitionData ? repetitionData.lieu : null,
              programme: repetitionData ? repetitionData.programme : null,
            };
          })
        );

        const concerts = await Promise.all(
          user.Concerts.map(async (concert) => {
            const concertDetails = await Concert.findById(concert);
            if (!concertDetails) {
              return null;
            }

            if (saisonId && concertDetails.saison != saisonId) {
              return null;
            }

            if (oeuvreId && !concertDetails.programme.includes(oeuvreId)) {
              return null;
            }

            const oeuvres = await Promise.all(
              concertDetails.programme.map(async (oeuvre) => {
                const oeuvreData = await Oeuvre.findById(oeuvre);
                return {
                  title: oeuvreData ? oeuvreData.titre : "Unknown Title",
                };
              })
            );

            const saisonData = await Saison.findById(concertDetails.saison);
            const saisonName = saisonData ? saisonData.nom : "Unknown Season";

            return {
              nom: concertDetails.nom,
              date: concertDetails.date,
              lieu: concertDetails.lieu,
              saison: saisonName,
              ouevres,
            };
          })
        );

        const filteredConcerts = concerts.filter((concert) => concert !== null);

        return {
          userId: user._id,
          firstName: user.firstName, // Add firstName
          lastName: user.lastName, // Add lastName
          totalRepetitions,
          totalConcerts,
          repetitionsHistory,
          concerts: filteredConcerts,
        };
      })
    );

    res.json({ activityHistories });
  } catch (error) {
    console.error("Error fetching user activity history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUserActivityHistory,
  getUserActivityHistory ,
  getProfileAndStatusHistory
};

const StatusHistory=require('../models/StatusHistory');
const saison=require('../models/saison');
const {getChoristesNominés,getChoristesÉliminés}=require('../controllers/absenceElemination')

const getListeChoristes = async () => {
  try {
    
    const choristes = await User.find({ role: 'choriste' });

    
    return choristes;
  } catch (error) {
    
    console.error(error);
    throw new Error('Erreur lors de la récupération de la liste des choristes.');
  }
};
const voirProfilChoriste = async (idUser) => {
  try {
    const choriste = await User.findById(idUser);
    if (!choriste) {
      throw new Error('Choriste non trouvé.');
    }

    // Récupérer les informations du choriste
    // ...

    // Récupérer la liste des nominés et éliminés pour affichage dans le profil
    const choristesNominés = await getChoristesNominés();
    const choristesÉliminés = await getChoristesÉliminés();

    return {
      infosChoriste: choriste,
      choristesNominés,
      choristesÉliminés,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Erreur lors de la récupération du profil du choriste.');
  }
};

const getProfile = async (req, res) => {
  try {
    const {
      statusHistory,
      nbsaison,
      concertsValidated,
      repetitionsValidated,
    } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId).populate('StatusHistory').exec();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    let currentStatus = 'Inactif';

    if (!StatusHistory || StatusHistory.length === 0 || !StatusHistory[0].nbsaison) {
      currentStatus = 'Choriste Junior';
    } else {
      const firstSeasonYear = StatusHistory[0].nbsaison;

      const currentYear = new Date().getFullYear();

      const yearsOfMembership = currentYear - firstSeasonYear + 1;

      if (yearsOfMembership === 1) {
        currentStatus = 'Choriste';
      } else if (yearsOfMembership === 3 && (concertsValidated >= 10 || repetitionsValidated >= 20)) {
        currentStatus = 'Choriste Senior';
      } else if (firstSeasonYear === 2018) {
        currentStatus = 'Veteran';
      }
    }

    res.status(200).json({ success: true, data: { profile: user.toPublic(), StatusHistory, currentStatus } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getProfile,
  getListeChoristes,
  voirProfilChoriste
};