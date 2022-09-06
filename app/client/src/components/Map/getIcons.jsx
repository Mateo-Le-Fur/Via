import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  FaLeaf,
  FaFootballBall,
  FaHandsHelping,
  FaTools,
} from 'react-icons/fa';
import { GiCook, GiPalette } from 'react-icons/gi';

export default function getIcon(type) {
  const sportIcon = renderToStaticMarkup(
    <FaFootballBall size={42} className='icon iconMap' />
  );

  const artIcon = renderToStaticMarkup(
    <GiPalette size={42} className='icon iconMap' />
  );

  const diyIcon = renderToStaticMarkup(<FaTools size={42} className='icon iconMap' />);

  const charityIcon = renderToStaticMarkup(
    <FaHandsHelping size={42} className='icon iconMap' />
  );

  const cookIcon = renderToStaticMarkup(<GiCook size={42} className='icon iconMap' />);

  const gardeningIcon = renderToStaticMarkup(
    <FaLeaf size={42} className='icon iconMap' />
  );

  let html;

  switch (type) {
    case 'Arts':
      html = artIcon;
      break;
    case 'Danse':
      html = sportIcon;
      break;
    case 'Bricolage':
      html = diyIcon;
      break;
    case 'Bénévolat':
      html = charityIcon;
      break;
    case 'Cuisine':
      html = cookIcon;
      break;
    case 'Jardinage':
      html = gardeningIcon;
      break;
    default:
      break;
  }

  const markupIcon = divIcon({
    html,
  });

  return markupIcon;
}
