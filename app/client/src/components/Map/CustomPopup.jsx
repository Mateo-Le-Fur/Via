import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import img from "../../assets/images/no-user.png"
import { Popup, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiLocationMarker,
  HiCalendar,
  HiTrash,
  HiPencil,
} from 'react-icons/hi';

import { FaStar, FaChevronLeft, FaPhone, FaUser } from 'react-icons/fa';
import { createBookmark, deleteActivity, deleteBookmark, updateActivity } from '../../features/activity/activitySlice';

const CustomPopup = ({ id, type, activity }) => {

  // const [avatar, setAvatar] = useState("")
  // useEffect(() => {
  //   const fetchAvatar = async () => {
  //     const userAvatar = await fetch(`/api/user/${activity.user_id}/avatar`, {
  //       method: 'GET',
  //     });

  //     setAvatar(userAvatar.url)
  //   }
    
  //   fetchAvatar()
  // }, [activity.user_id])

  const {user:current} = useSelector(state => state.auth);
  const {bookmarks} = useSelector(state => state.activity)
  const [edit, setEdit] = useState(false);
  const [mode, setMode] = useState('activity');
  const dispatch = useDispatch()
  const [form, setForm] = useState(
{
      name: activity.name,
      description: activity.description,
      address: activity.address
    }
  );
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  var now = new Date();
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + '-' + month + '-' + day;

  const handleUpdate = () => {
      if(form.name && form.description &&  form.address && date ){
        console.log({...form, date, type})
        dispatch(updateActivity({activityId: activity.id, activityData: {...form, date, type}}))
      }
  }

  const [date, setDate] = useState(today)

  const handleDate = (e) => {
    // const parsedDate = Date.parse(e.target.value)

    setDate(e.target.value)
  }

  const popupRef = useRef(activity)

  const map = useMap()
  useEffect(() => {
    if(activity.id === id){
      map.flyTo(activity.lat, activity.long)
      map.openPopup(popupRef.current)
    }
  }, [activity, id, map])

  const handleBookmark = () => {
    const booked = bookmarks.some(bookmark => {
      if(bookmark.id === activity.id){
        return true 
      }
      return false })
      if (booked) {
        dispatch(deleteBookmark(activity.id))
      } else {
        dispatch(createBookmark(activity.id))
      }
  }

  if (activity && activity.name && activity.description && activity.address && activity.date && activity.nickname)
    return (
      <Popup ref={popupRef}>
        <div>
          <div className='popupContainer'>
            {edit && (
              <div className='editContainer'>
                <div className='activityHeader'>
                  <input
                    name='name'
                    onChange={handleChange}
                    value={form.name}
                  />
                </div>
                <div className='dateContainer'>
                  <HiCalendar className='smIcon' />
                  <input type='date' onChange={handleDate} />
                </div>
                <div className='locationContainer'>
                  <HiLocationMarker className='smIcon' />
                  <input
                    name='address'
                    onChange={handleChange}
                    value={form.address}
                  />
                </div>
                <div className='descriptionContainer'>
                  <textarea
                    name='description'
                    id='description'
                    onChange={handleChange}
                    value={form.description}
                  >
                  </textarea>
                </div>
                <div className='buttonContainer'>
                  <button type='submit' className='btn' onClick={handleUpdate}>
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
            {mode === 'activity' && !edit && (
              <div className='activityContainer'>
                <div className='activityHeader'>
                  <h1>{activity?.name.length > 15 ? activity?.name.substring(0,15).concat("...") : activity?.name }</h1>
                  <span>
                    créé par 
                    <em onClick={() => setMode('user')}>{activity.nickname}</em>
                  </span>
                </div>
                <div className='dateContainer'>
                  <HiCalendar className='smIcon' /> <span>{activity.date}</span>
                </div>
                <div className='locationContainer'>
                  <HiLocationMarker className='smIcon' />{' '}
                  <span>{activity.address}</span>
                </div>
                <div className='descriptionContainer'>
                  {activity.description}
                </div>
              </div>
            )}
            {mode === 'user' && !edit && <div className='userContainer'>
            <span className="back">
                <FaChevronLeft onClick={() => setMode("activity")} className='actionIcon'/>
            </span>
              <div className="avatarContainer">
                <img src={activity.url} alt="" />
              </div>
              <div className="nicknameContainer">
                <span>{activity.nickname}</span>
              </div>
              <div className='addressContainer'>
                  <HiLocationMarker className='smIcon' /> <span>{activity.userAddress}</span>
                </div>
                <div className='namesContainer'>
                  <FaUser className='smIcon' /> <span>{activity.firstname}</span> 
                  <span>{activity.lastname}</span> 
                </div>
                <div className='phoneContainer'>
                  <FaPhone className='smIcon' /> 
                  <span>{activity.phone}</span> 
                </div>
                <div className='descriptionContainer'>
                  {activity.userDescription}
                </div>
            </div>}
            <div className='actions'>
              {current.id === activity.user_id && (
                    <div className='left'>
                      <div onClick={() => setEdit(!edit)}>
                      <HiPencil
                      className='actionIcon'
                   
                    />
                      </div>
                    <div  onClick={() => dispatch(deleteActivity(activity.id))} >
                    <HiTrash className='actionIcon' />
                    </div>
                 
                  </div>
              )}
              <div className='right'>
                <FaStar onClick={handleBookmark} className={bookmarks.some(bookmark => {
                  if(bookmark.id === activity.id){
                    return true 
                  }
                  return false
                }) ? "starIcon bookmark" : "starIcon"} />
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
};
export default CustomPopup;
