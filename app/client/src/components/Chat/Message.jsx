 
const Message = ({mine, message}) => {
  return (
    <div className={mine ? "message mine" : "message"}>
    <div className="row">
        <div className="avatar-img">
        <img src={message.avatar} alt="" />
        </div>
        <div className="nickname-box">
            Nickname
        </div>
    </div>
    <div className="content">
      {message.message}
    </div>
</div>
  )
}
export default Message