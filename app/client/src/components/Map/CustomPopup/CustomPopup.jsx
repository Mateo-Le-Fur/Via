import { useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Popup } from 'react-leaflet';
import { useSelector } from 'react-redux';
import Edit from './Edit/Edit';
import Activity from './Activity/Activity';
import User from './User/User';
import Comments from './Comments/Comments';
import Actions from './Actions/Actions';

const CustomPopup = ({ id, type }) => {

  const { participations } = useSelector(state => state.activity)
  const { activity } = useSelector(state => state.activity)
  const { user: current } = useSelector(state => state.auth);
  const { bookmarks } = useSelector(state => state.activity)
  const { comments } = useSelector(state => state.activity)

  // Modes
  const [edit, setEdit] = useState(false);
  const [mode, setMode] = useState('activity');

  const handleSetMode = (value) => {
    setMode(value)
  }

  const handleSetEdit = (value) => {
    setEdit(value)
  }


  return (
    <Popup>
      {activity && activity.name && activity.description && activity.address && activity.date && activity.nickname && (
        <div>
          <div className='popupContainer'>
            {/* Edit mode */}
            {edit && (
              <Edit activity={activity} type={type} />
            )}
            {/* Activity */}
            {mode === 'activity' && !edit && (
              <Activity activity={activity} handleSetMode={handleSetMode} />
            )}
            {/* User */}
            {mode === 'user' && !edit && <User activity={activity} handleSetMode={handleSetMode} />}
            {/* Comments */}
            {
              mode === "comments" && !edit && <Comments activity={activity} comments={comments} handleSetMode={handleSetMode} />
            }
            {/* Actions */}
            {
              mode !== "comments" && (
                <Actions current={current} activity={activity} edit={edit} handleSetEdit={handleSetEdit} handleSetMode={handleSetMode} bookmarks={bookmarks} comments={comments} participations={participations} />
              )
            }
          </div>
        </div>
      )}
    </Popup>
  );
};

export default CustomPopup;
