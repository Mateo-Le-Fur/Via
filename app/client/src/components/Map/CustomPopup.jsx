import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Popup, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
// import { deleteActivity, updateActivity } from '../../store/activity/activitySlice';"
import { fr } from 'react-date-range/src/locale';
import {
  HiLocationMarker,
  HiCalendar,
  HiSearch,
  HiTrash,
  HiUser,
  HiPencil,
  HiThumbUp,
} from 'react-icons/hi';

import { FaStar, FaChevronLeft, FaPhone, FaUser } from 'react-icons/fa';

import { activities } from '../../pages/Home/data';
import { Calendar } from 'react-date-range';

const CustomPopup = ({ id, type }) => {
  //   const { activity } = useSelector((state) => state.activity);

  const activity = activities.find((activity) => activity.id === id);

  const user = {
    nickname: 'Johnny92',
    email: 'john@mail.com',
    city: 'Paris',
    firstname: 'John',
    lastname: 'doe',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem doloribus aperiam possimus nostrum atque natus fugit at sequi quos labore. Optio eligendi illo ipsum voluptatibus perspiciatis expedita suscipit, nihil maxime.",
    address: "80 rue de l'exemple",
    phone: '0727737277',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
  };

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

  const [form, setForm] = useState({
    name: activity.name,
    descriptiom: activity.description,
    address: activity.address,
    date: activity.date,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  var now = new Date();
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + '-' + month + '-' + day;

  if (activity)
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
                  <input type='date' defaultValue={today} />
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
                  >
                    {form.descriptiom}
                  </textarea>
                </div>
                <div className='buttonContainer'>
                  <button type='submit' className='btn'>
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
            {mode === 'activity' && !edit && (
              <div className='activityContainer'>
                <div className='activityHeader'>
                  <h1>{activity.name}</h1>{' '}
                  <span>
                    créé par{' '}
                    <em onClick={() => setMode('user')}>{activity.user}</em>
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
                <img src={user.avatar} alt="" />
              </div>
              <div className="nicknameContainer">
                <span>{user.nickname}</span>
              </div>
              <div className='addressContainer'>
                  <HiLocationMarker className='smIcon' /> <span>{user.address}</span>
                </div>
                <div className='namesContainer'>
                  <FaUser className='smIcon' /> <span>{user.firstname}</span> 
                  <span>{user.lastname}</span> 
                </div>
                <div className='phoneContainer'>
                  <FaPhone className='smIcon' /> <span>{user.firstname}</span> 
                  <span>{user.phone}</span> 
                </div>
                <div className='descriptionContainer'>
                  {user.description}
                </div>
            </div>}
            <div className='actions'>
              <div className='left'>
                <HiPencil
                  className='actionIcon'
                  onClick={() => setEdit(!edit)}
                />
                <HiTrash className='actionIcon' />
              </div>
              <div className='right'>
                <FaStar className='starIcon' />
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
};
export default CustomPopup;
