import { useEffect, useRef, useState } from 'react';
import { Popup, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
// import { deleteActivity, updateActivity } from '../../store/activity/activitySlice';"
import {
  HiLocationMarker,
  HiCalendar,
  HiSearch,
  HiTrash,
  HiUser,
  HiPencil,
  HiThumbUp,
} from 'react-icons/hi';
import {FaStar} from "react-icons/fa"

import { activities } from '../../pages/Home/data';

const CustomPopup = ({ id, type }) => {
  //   const { activity } = useSelector((state) => state.activity);

  const activity = activities.find((activity) => activity.id === id);

  const map = useMap();
  const popupRef = useRef(activity);
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     if (activity.id === id) {
  //       map.flyTo([activity.location[0], activity.location[1]]);
  //       map.openPopup(popupRef.current);
  //     }

  //   }, [activity, id, map]);

  const [edit, setEdit] = useState(false);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('activity');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  if (activity)
    return (
      <Popup ref={popupRef}>
        <div>
            <div className="popupContainer">

         
          {edit && <div className='editContainer'>
            edit
          </div>}
          {mode === 'activity' && !edit && <div className='activityContainer'>
            acivity
          </div>}
          {mode === 'user' && !edit && <div className='userContainer'>

          </div>}
          <div className="actions">
            <div className="left">
                <HiPencil className='actionIcon' onClick={() => setEdit(!edit)}/>
                <HiTrash className="actionIcon" />
            </div>
            <div className="right">
                <FaStar className='starIcon' />
            </div>
          </div>
          </div>
        </div>
      </Popup>
    );
};
export default CustomPopup;
