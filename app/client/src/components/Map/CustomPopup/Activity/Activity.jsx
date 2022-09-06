import "./Activity.scss";
import {
  HiLocationMarker,
  HiCalendar,
} from 'react-icons/hi';

const Activity = ({ activity, handleSetMode }) => {
  return (
    <div className='activityContainer'>
      <div className='activityHeader'>
        <h1>{activity?.name.length > 15 ? activity?.name.substring(0, 15).concat("...") : activity?.name}</h1>
        <span>
          créé par
          <em onClick={() => handleSetMode('user')}>{activity.nickname}</em>
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
  )
}
export default Activity