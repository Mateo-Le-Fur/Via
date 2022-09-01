import './Card.scss';
import { format } from "date-fns";
import {getIcon} from "./getIcon"
import { createBookmark, deleteBookmark, participate } from '../../features/activity/activitySlice';

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
import { activePanel, handleHideList, handleHideSidebar } from '../../features/global/globalSlice';




const Card = ({kind, activity}) => {


const {participations} = useSelector(state => state.activity)
const {user} = useSelector(state => state.auth)
const {bookmarks} = useSelector(state => state.activity)
const dispatch = useDispatch()
const handleBookmark = () => {
  const booked = bookmarks.includes(activity.id)
  console.log(booked)
    if (booked) {
      dispatch(deleteBookmark(activity.id))
    } else {
      dispatch(createBookmark(activity.id))
    }
}

if (participations){


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
            dispatch(handleHideSidebar())
            dispatch(activePanel(""))
            dispatch(getActivity(activity.id))
          }} >
          <HiSearch className='actionIcon' />
          </div>
          <div>
          <FaStar onClick={handleBookmark} className={bookmarks.includes(activity.id) ? "actionIcon bookmark" : "actionIcon"}  />
          </div>
           
        </div>

        <div className='middle'>
            <div className='actionMiddle'>Ça m'intéresse <span>(12)</span></div>
            <div style={{padding: "0 .2rem"}}> /</div>
            <div className='actionMiddle' onClick={() => dispatch(participate(activity.id))}> Je participe <span>({participations?.find(el => el.id === activity.id)?.count || 0})</span></div>
        </div>

          {user.id === activity.user_id && (
              <div className='right'>
                <div>
                <HiTrash className='actionIcon' onClick={() => dispatch(deleteActivity({activityId: activity.id, userId: activity.user_id}))} />
                </div>
            </div>
          )}
      
      </div>
    </div>
  );
}
}
export default Card;
