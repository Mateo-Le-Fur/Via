import './Card.scss';
import { format } from "date-fns";
import {getIcon} from "./getIcon"

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
import { useDispatch } from 'react-redux';
import { getActivity } from '../../features/activity/activitySlice';
import { handleHideList } from '../../features/global/globalSlice';




const Card = ({kind, activity}) => {

  const dispatch = useDispatch()


  return (
    <div className='card'>
      <div className='top'>
        <div className='name'>{activity.name.length > 30 ? activity.name.substring(0,30).concat("...") : activity.name}</div>
        <div className='type'>
          {getIcon(activity.type)}
        </div>
      </div>
      <div className='middle'>
        <div className='row first'>
          <div>
            <HiUser className='smIcon' /> Créé par <span className='author'>{activity.nickname}</span>
          </div>
          <div>
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
          <HiSearch onClick={() => {
            dispatch(handleHideList())
            dispatch(getActivity(activity.id))
          }} className='actionIcon' />
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
