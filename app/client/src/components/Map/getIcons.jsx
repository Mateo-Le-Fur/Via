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
    <FaFootballBall size={42} className='icon' />
  );

  const artIcon = renderToStaticMarkup(
    <GiPalette size={42} className='icon' />
  );

  const diyIcon = renderToStaticMarkup(<FaTools size={42} className='icon' />);

  const charityIcon = renderToStaticMarkup(
    <FaHandsHelping size={42} className='icon' />
  );

  const cookIcon = renderToStaticMarkup(<GiCook size={42} className='icon' />);

  const gardeningIcon = renderToStaticMarkup(
    <FaLeaf size={42} className='icon' />
  );

  let html;

  switch (type) {
    case 'art':
      html = artIcon;
      break;
    case 'sport':
      html = sportIcon;
      break;
    case 'diy':
      html = diyIcon;
      break;
    case 'charity':
      html = charityIcon;
      break;
    case 'cook':
      html = cookIcon;
      break;
    case 'gardening':
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
