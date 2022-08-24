import './Card.scss';
import { format } from "date-fns";

import { FaGuitar, FaStar} from 'react-icons/fa';
import {
  HiLocationMarker,
  HiCalendar,
  HiSearch,
  HiTrash,
  HiUser,
  HiPencil,
  HiThumbUp
} from 'react-icons/hi';




const Card = ({kind, activity}) => {
  return (
    <div className='card'>
      <div className='top'>
        <div className='name'>{activity.name}</div>
        <div className='type'>
          <FaGuitar className='iconCard' />
        </div>
      </div>
      <div className='middle'>
        <div className='row first'>
          <div>
            {' '}
            <HiUser className='smIcon' /> Créé par <span>{activity.nickname}</span>
          </div>
          <div>
            {' '}
            <HiCalendar className='smIcon' /> {activity.date}
          </div>
        </div>
        <div className='row'>
          <div>
            <HiLocationMarker className='smIcon' />
            {activity.address}
          </div>
        </div>
        <main>
          {activity.description}
        </main>
      </div>
      <div className='bottom'>
        <div className='left'>
          <HiSearch className='actionIcon' />
          <HiThumbUp className='actionIcon' />
          <FaStar className='actionIcon' />
        </div>

        <div className='right'>
          <HiPencil className='actionIcon' />
          <HiTrash className='actionIcon' />
        </div>
      </div>
    </div>
  );
};
export default Card;
