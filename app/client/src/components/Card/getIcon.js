import {
    FaLeaf,
    FaFootballBall,
    FaHandsHelping,
    FaTools,
  } from 'react-icons/fa';
  import { GiCook, GiPalette } from 'react-icons/gi';

export const getIcon = (type) => {
    let icon;
    switch (type) {
        case 'Arts':
          icon = <GiPalette className='iconCard'/>;
          break;
        case 'Danse':
          icon = <FaFootballBall className='iconCard'/>;
          break;
        case 'Bricolage':
          icon = <FaTools className='iconCard' />;
          break;
        case 'Bénévolat':
          icon = <FaHandsHelping className='iconCard' />;
          break;
        case 'Cuisine':
          icon = <GiCook className='iconCard' />;
          break;
        case 'Jardinage':
          icon = <FaLeaf className='iconCard'/>;
          break;
        default:
          break;
      }
      return icon
}