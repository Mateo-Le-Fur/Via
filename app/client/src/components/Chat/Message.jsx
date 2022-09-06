import { useSelector } from "react-redux"

const Message = ({ mine, message }) => {

  const { user } = useSelector(state => state.auth)
  
  return (
    <div className={mine ? "message mine" : "message"}>
      <div className={mine ? "nickname-box mine" : "nickname-box"}>
        <span>
        {message.exp_user_id !== user.id ? message.user : "Vous"}
        </span>
      </div>
      <div className={mine ? "message-box mine" : "message-box"}>
        <div className="row">
          <div className="avatar-img">
            <img src={message.avatar} alt="" />
          </div>
        </div>
        <div className="content">
          {message.message}
        </div>
        <div className="message-date">
          {message.date}
        </div>
      </div>
    </div>
  )
}

export default Message