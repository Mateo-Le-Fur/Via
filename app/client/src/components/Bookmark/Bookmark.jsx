import { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../Card/Card';
import "./Bookmark.scss";

const Bookmark = () => {
  const {activities} = useSelector(state => state.activity)
  const {bookmarks} = useSelector(state => state.activity)
  const [filtered, setFiltered] = useState(activities.filter(activity => bookmarks.indexOf(activity.id) !== -1))
  return (
    <div className="bookmark">
      <div className="activityList">
        {filtered.length > 0 ? 
            filtered.map(bookmark => (
              <Card  kind='bookmark' key={bookmark.id} activity={bookmark}/>
            ))
         :  <h2>Vous n'avez aucun favoris</h2>}
       
      </div>
    </div>
  )
}
export default Bookmark