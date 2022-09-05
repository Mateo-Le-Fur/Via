import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import img from "../../assets/images/no-user.png"
import {FaPaperPlane} from "react-icons/fa"
import { Popup, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiLocationMarker,
  HiCalendar,
  HiTrash,
  HiPencil,
} from 'react-icons/hi';

import { FaStar, FaChevronLeft, FaPhone, FaUser } from 'react-icons/fa';
import { addComment, createBookmark, deleteActivity, deleteBookmark, participate, updateActivity } from '../../features/activity/activitySlice';
import { addMessage } from '../../features/auth/authSlice';

const CustomPopup = ({ id, type }) => {
  const { participations } = useSelector(state => state.activity)
  const { activity } = useSelector(state => state.activity)
  const map = useMap()
  const popupRef = useRef(activity)
  
  const { user: current } = useSelector(state => state.auth);
  const { bookmarks } = useSelector(state => state.activity)
  const {comments} = useSelector(state => state.activity)
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



  // useEffect(() => {
   
  //   if(activity.id === id ){
  //     map.flyTo([activity.lat, activity.long])
      
  //     // if(popupRef.current && popupRef.current._latlng && popupRef.current._latlng.lat && popupRef.current._latlng.lng){
  //     //   map.openPopup(popupRef.current)
  //     // }
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

  const commentsRef = useRef()

  const [inputComment, setInputComment] = useState("")
  const submitComment = (e) => {
    e.preventDefault()
    if (inputComment && inputComment.length < 250){
      dispatch(addComment({activityId: activity.id, text: inputComment}))
      setInputComment("")
      setTimeout(() => {

        commentsRef.current.scroll(0, commentsRef.current.scrollHeight)
      }, 100)
    }
  }

  // message
  const [inputMessage, setInputMessage] = useState("")
  const submitMessage = (e) => {
    e.preventDefault()
    if (inputMessage && inputMessage.length < 250){
      dispatch(addMessage({recipientId: activity.user_id, message: inputMessage}))
      setInputMessage("")
    }
  }

    return (
      <Popup ref={popupRef}>
        {activity && activity.name && activity.description && activity.address && activity.date && activity.nickname && (

 
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
                <div>
                <img src={activity.url} alt="" />
                </div>
              </div>
              <div className="nicknameContainer">
                <span>{activity.nickname}</span>
              </div>
              {!activity.userAddress && !activity.firstname && !activity.lastname && !activity.phone && !activity.userDescription ? (
                  <p>L'utilisateur n'a pas encore renseigné ces infromations</p>
              ): (
                <>
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
                  </>
              )}
             
             <form  className={inputMessage.length > 250 ? "message form-error" : "message"}  onSubmit={submitMessage}>
                  <textarea lassName={inputMessage.length > 250 ? "input-error" : ""}  placeholder='Envoyer un message...' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}></textarea> 
                  <button className={inputMessage.length > 250 ? "disabled" : ""} disabled={inputMessage.length > 250} style={{fontSize: "1.2rem"}} type='submit'><FaPaperPlane /></button>
                </form>
            </div>}
            {
              mode === "comments" && !edit && <div className='commentsContainer'>
                <span className="back">
                  <FaChevronLeft  onClick={() => setMode("activity")} className="chevron" />
                </span>
                <div className="comments" ref={commentsRef}>
                {comments.length > 0 ? comments.filter(comment => comment.activity_id === activity.id).map(comment => (
                         <div key={comment.id} className="comment">
                         <div className="head">
                           <div><img src={comment.avatar} alt="" /> <span>{comment.user}</span></div>
                           <div>{comment.date}</div>
                         </div>
                         <div className="content">
                          {comment.text}
                         </div>
                       </div>
                  
)): <p>Il n'y a pas encore de commentaires</p>}
                 
                </div>
                <form  className={inputComment.length > 250 ? "add form-error" : "add"}  onSubmit={submitComment}>
                  <textarea lassName={inputComment.length > 250 ? "input-error" : ""}  placeholder='Ajouter un commentaire...' value={inputComment} onChange={(e) => setInputComment(e.target.value)}></textarea> 
                  <button className={inputComment.length > 250 ? "disabled" : ""} disabled={inputComment.length > 250} style={{fontSize: "1.2rem"}} type='submit'><FaPaperPlane /></button>
                </form>
              </div>
            }
            {
              mode !== "comments" && (
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
                  <div className='actionMiddle' onClick={() => setMode("comments")}>Commentaires <span>({comments?.filter(comment => comment.activity_id === activity.id)?.length || 0})</span></div>
                  <div> /</div>
                  <div className='actionMiddle' onClick={() => dispatch(participate(activity.id))}> Je participe <span>({participations?.find(el => el.id === activity.id)?.count || 0})</span></div>
                </div>
  
                <div className='right'>
                  <div onClick={handleBookmark} >
                    <FaStar className={bookmarks && bookmarks.includes(activity.id)
                      ? "starIcon bookmark" : "starIcon"} />
                  </div>
  
                </div>
  
              </div>
              )
            }

          </div>
        </div>
               )}
      </Popup>
    );
};
export default CustomPopup;
