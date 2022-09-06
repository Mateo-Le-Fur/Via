import "./Actions.scss";
import {FaStar} from "react-icons/fa"
import {HiPencil, HiTrash} from "react-icons/hi"
import { useDispatch } from "react-redux";
import { createBookmark, deleteActivity, deleteBookmark, participate } from "../../../../features/activity/activitySlice";

const Actions = ({current, activity, edit, handleSetEdit, handleSetMode, bookmarks, comments, participations}) => {
const dispatch = useDispatch()
    // Bookmark
  const handleBookmark = () => {
    const booked = bookmarks.includes(activity.id)

    if (booked) {
      dispatch(deleteBookmark(activity.id))
    } else {
      dispatch(createBookmark(activity.id))
    }
  }
  return (
    <div className='actions'>
    {current.id === activity.user_id && (
      <div className='left'>
        <div onClick={() => handleSetEdit(!edit)}>
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
      <div className='actionMiddle' onClick={() => handleSetMode("comments")}>Commentaires <span>({comments?.filter(comment => comment.activity_id === activity.id)?.length || 0})</span></div>
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
export default Actions