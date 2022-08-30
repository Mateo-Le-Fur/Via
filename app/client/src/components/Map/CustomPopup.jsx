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
import { createBookmark, deleteActivity, deleteBookmark, participate, updateActivity } from '../../features/activity/activitySlice';

const CustomPopup = ({ id, type }) => {
  const { participations } = useSelector(state => state.activity)
  const { activity } = useSelector(state => state.activity)
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

  const { user: current } = useSelector(state => state.auth);
  const { bookmarks } = useSelector(state => state.activity)
  const [edit, setEdit] = useState(false);
  const [mode, setMode] = useState('activity');
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: ""
  }
    // {
    //   name: activity.name,
    //   description: activity.description,
    //   address: activity.address
    // }
  );
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(form)
  var now = new Date();
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + '-' + month + '-' + day;

  const handleUpdate = () => {
    const object = {
      name: form.name ? form.name : activity.name,
      description: form.description ? form.description : activity.description,
      address: form.address ? form.address : activity.address,
      date: date ? date : activity.date,
    }
    dispatch(updateActivity({ activityId: activity.id, activityData: { ...object, type } }))

  }

  const [date, setDate] = useState(today)

  const handleDate = (e) => {
    // const parsedDate = Date.parse(e.target.value)

    setDate(e.target.value)
  }

  const popupRef = useRef(activity)

  const map = useMap()
  // useEffect(() => {
  //   if(activity.id === id){
  //     map.flyTo(activity.lat, activity.long)
  //     map.openPopup(popupRef.current)
  //   }
  // }, [activity, id, map])

  const handleBookmark = () => {
    const booked = bookmarks.includes(activity.id)

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
                    defaultValue={activity.name}
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
                    defaultValue={activity.address}
                  />
                </div>
                <div className='descriptionContainer'>
                  <textarea
                    name='description'
                    id='description'
                    onChange={handleChange}
                    defaultValue={activity.description}
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
                  <h1>{activity?.name.length > 15 ? activity?.name.substring(0, 15).concat("...") : activity?.name}</h1>
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
                <FaChevronLeft onClick={() => setMode("activity")} className='actionIcon' />
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
            {
              mode === "comments" && !edit && <div className='commentsContainer'>
                <span className="back">
                  <FaChevronLeft onClick={() => setMode("activity")} className='actionIcon' />
                </span>
                <div className="row">{activity.name}</div>
                <div className="comments">
                  <div className="comment">
                    <div className="head">
                      <div><img src={activity.url} alt="" /> <span>Marcel</span></div>
                      <div>date</div>
                    </div>
                    <div className="content">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam alias non beatae porro aut ipsum. Ut ipsa necessitatibus magni alias.
                    </div>
                  </div>
                  <div className="comment">
                    <div className="head">
                      <div><img src={activity.url} alt="" /> <span>Marcel</span></div>
                      <div>date</div>
                    </div>
                    <div className="content">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi officia dicta nostrum facere assumenda reiciendis sit odio iste accusamus illum!
                    </div>
                  </div>
                  <div className="comment">
                    <div className="head">
                      <div><img src={activity.url} alt="" /> <span>Marcel</span></div>
                      <div>date</div>
                    </div>
                    <div className="content">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium dicta dignissimos cumque voluptate omnis quia molestiae facere quae maxime nulla?
                    </div>
                  </div>
                  <div className="comment">
                    <div className="head">
                      <div><img src={activity.url} alt="" /> <span>Marcel</span></div>
                      <div>date</div>
                    </div>
                    <div className="content">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur ipsum minima placeat eos perferendis necessitatibus mollitia nobis unde quidem eaque.
                    </div>
                  </div>
                  <div className="comment">
                    <div className="head">
                      <div><img src={activity.url} alt="" /> <span>Marcel</span></div>
                      <div>date</div>
                    </div>
                    <div className="content">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quis ad dolore eaque laborum. Dolores ut sequi vitae libero neque.
                    </div>
                  </div>
                </div>
                <div className='add'>
                  <input type="text" placeholder='Ajouter un commentaire...' />
                </div>
              </div>
            }
            <div className='actions'>
              {current.id === activity.user_id && (
                <div className='left'>
                  <div onClick={() => setEdit(!edit)}>
                    <HiPencil
                      className='actionIcon'

                    />
                  </div>
                  <div onClick={() => dispatch(deleteActivity({ activityId: activity.id, userId: activity.user_id }))} >
                    <HiTrash className='actionIcon' />
                  </div>

                </div>
              )}

              <div className='middle'>
                <div className='actionMiddle' onClick={() => setMode("comments")}>Commentaires <span>(12)</span></div>
                <div> /</div>
                <div className='actionMiddle' onClick={() => dispatch(participate(activity.id))}> Je participe <span>({participations?.find(el => el.id === activity.id)?.count || 0})</span></div>
              </div>

              <div className='right'>
                <div onClick={handleBookmark} >
                  <FaStar className={bookmarks && bookmarks.includes(activity.id)
                    ? "starIcon bookmark" : "starIcon"} />
                </div>

              </div>
              {/* <div className='right'>
                <FaStar onClick={() =>  dispatch(deleteBookmark(activity.id))} className={bookmarks && bookmarks.includes(activity.id)
                 ? "starIcon bookmark" : "starIcon"} />
              </div> */}
            </div>
          </div>
        </div>
      </Popup>
    );
};
export default CustomPopup;
