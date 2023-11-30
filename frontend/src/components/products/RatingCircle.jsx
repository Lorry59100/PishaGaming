import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from 'prop-types';

const RatingCircle = ({ tests }) => {
  const calculateAverageRating = (tests) => {
    const total = tests.reduce((sum, test) => sum + test.rate, 0);
    const averageRating = tests.length > 0 ? total / tests.length : 0;
    return averageRating; // Note moyenne non modifiée
  };

  const averageRating = calculateAverageRating(tests);
  const percentageRating = (averageRating / 20) * 100; // Convertir la note en pourcentage
  const needDominantBaselineFix = true;

  // Définir les couleurs en fonction de la note
  let circleColor = '#ff0000'; // Rouge par défaut
  if (averageRating >= 9 && averageRating < 14) {
    circleColor = '#ffa500'; // Orange si la note est entre 9 et 13
  } else if (averageRating >= 14) {
    circleColor = '#008000'; // Vert si la note est 14 ou plus
  }

  return (
    <div className="rating-circle">
      <CircularProgressbar
        value={percentageRating}
        text={
          <tspan dy={needDominantBaselineFix ? 1 : 0}>
          {Math.round(averageRating)}
          </tspan>}
        styles={buildStyles({
          textSize: '40px', // Taille du texte à l'intérieur du cercle
          textColor: '#ffffff', // Couleur du texte
          pathColor: circleColor, // Couleur du cercle de notation
          trailColor: '#ccc', // Couleur du cercle de fond
        })}
        />
    </div>
  );
};

RatingCircle.propTypes = {
    tests: PropTypes.arrayOf(
      PropTypes.shape({
        rate: PropTypes.number.isRequired,
        // ... autres propriétés de test si nécessaires ...
      })
    ).isRequired,
  };

export default RatingCircle;
