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
  HiThumbUp
} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { getActivity, deleteActivity } from '../../features/activity/activitySlice';
import { handleHideList } from '../../features/global/globalSlice';




const Card = ({kind, activity}) => {

  const dispatch = useDispatch()
const {user} = useSelector(state => state.auth)

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
          <div onClick={() => {
            dispatch(handleHideList())
            dispatch(getActivity(activity.id))
          }} >
          <HiSearch className='actionIcon' />
          </div>
          <div>
          <HiThumbUp className='actionIcon' />
          </div>
          <div>
          <FaStar className='actionIcon' />
          </div>
        </div>

          {user.id === activity.user_id && (
              <div className='right'>
              <HiTrash className='actionIcon' onClick={() => dispatch(deleteActivity(activity.id))} />
            </div>
          )}
      
      </div>
    </div>
  );
};
export default Card;
