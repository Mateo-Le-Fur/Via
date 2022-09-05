 
const Message = ({mine, message}) => {
  return (
    <div className={mine ? "message mine" : "message"}>
    <div className="row">
        <div className="avatar-img">
        <img src={message.avatar} alt="" />
        </div>
        <div className="nickname-box">
            {message.user}
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