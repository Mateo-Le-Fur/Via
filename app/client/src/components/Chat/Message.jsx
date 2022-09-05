import { useSelector } from "react-redux"

 
const Message = ({mine, message}) => {
  const {user} = useSelector(state => state.auth)

  return (
    <div className={mine ? "message mine" : "message"}>
    <div className="row">
        <div className="avatar-img">
        <img src={message.avatar} alt="" />
        </div>
        <div className="nickname-box">
            {message.exp_user_id !== user.id ? message.user : "Vous"}
        </div>
    </div>
    <div className="content">
      {message.message}
    </div>
    <div className="message-date">
      {message.date}
    </div>
</div>
  )
}
export default Message