import "./Comments.scss";
import { FaChevronLeft, FaPaperPlane } from "react-icons/fa";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../../../features/activity/activitySlice";

const Comments = ({ activity, handleSetMode, comments }) => {
  const commentsRef = useRef()
  const dispatch = useDispatch()
  const [inputComment, setInputComment] = useState("")
  const submitComment = (e) => {
    e.preventDefault()
    if (inputComment && inputComment.length < 250) {
      dispatch(addComment({ activityId: activity.id, text: inputComment }))
      setInputComment("")
      setTimeout(() => {

        commentsRef.current.scroll(0, commentsRef.current.scrollHeight)
      }, 100)
    }
  }
  return (
    <div className='commentsContainer'>
      <span className="back">
        <FaChevronLeft onClick={() => handleSetMode("activity")} className="chevron" />
      </span>
      <div className="comments" ref={commentsRef}>
        {comments.length > 0 ? comments.filter(comment => comment.activity_id === activity.id).map(comment => (
          <div key={comment.id} className="comment">
            <div className="head">
              <div><img src={comment.avatar} alt="" /> <span>{comment.nickname}</span></div>
              <div>{comment.date}</div>
            </div>
            <div className="content">
              {comment.text}
            </div>
          </div>
        )) : <p>Il n'y a pas encore de commentaires</p>}
      </div>
      <form className={inputComment.length > 250 ? "add form-error" : "add"} onSubmit={submitComment}>
        <textarea lassName={inputComment.length > 250 ? "input-error" : ""} placeholder='Ajouter un commentaire...' value={inputComment} onChange={(e) => setInputComment(e.target.value)}></textarea>
        <button className={inputComment.length > 250 ? "disabled" : ""} disabled={inputComment.length > 250} style={{ fontSize: "1.2rem" }} type='submit'><FaPaperPlane /></button>
      </form>
    </div>
  )
}
export default Comments