import "./User.scss";
import { FaChevronLeft, FaPhone, FaUser, FaPaperPlane } from 'react-icons/fa';

import {
  HiLocationMarker,
} from 'react-icons/hi';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addMessage } from "../../../../features/auth/authSlice";

const User = ({ activity, handleSetMode }) => {
  const dispatch = useDispatch()
  const [inputMessage, setInputMessage] = useState("")
  const submitMessage = (e) => {
    e.preventDefault()
    if (inputMessage && inputMessage.length < 250) {
      dispatch(addMessage({ recipientId: activity.user_id, message: inputMessage }))
      setInputMessage("")
    }
  }
  return (
    <div className='userContainer'>
      <span className="back">
        <FaChevronLeft onClick={() => handleSetMode("activity")} className='actionIcon' />
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
      ) : (
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
      <form className={inputMessage.length > 250 ? "message form-error" : "message"} onSubmit={submitMessage}>
        <textarea lassName={inputMessage.length > 250 ? "input-error" : ""} placeholder='Envoyer un message...' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}></textarea>
        <button className={inputMessage.length > 250 ? "disabled" : ""} disabled={inputMessage.length > 250} style={{ fontSize: "1.2rem" }} type='submit'><FaPaperPlane /></button>
      </form>
    </div>
  )
}
export default User