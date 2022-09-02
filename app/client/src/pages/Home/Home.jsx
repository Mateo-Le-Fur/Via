import { useDispatch, useSelector } from 'react-redux'
import Map from '../../components/Map/Map'
import OutsideWrapper from '../../hooks/ClickOutsideHook'
import "./Home.scss"
import Panel from './Panel/Panel'
import Sidebar from './Sidebar/Sidebar'
import Modal from "./Modal/Modal"
import List from './List/List'
import CustomLayer from '../../components/Map/CustomLayer'
import { useEffect, useMemo, useState } from 'react'
import { getActivities, getBookmarks, getComments, getFirstParticipations, realTimeComments, realTimeParticipations } from '../../features/activity/activitySlice'
import { checkUser } from '../../features/auth/authSlice'
let participeSource;
let commentSource;


const Home = () => {
  const { user, message } = useSelector(state => state.auth)
  const {filter} = useSelector(state => state.global)
  const [markerGroups, setMarkerGroups] = useState([])
  const dispatch = useDispatch()
  const {activities} = useSelector(state => state.activity)
  const {participations} = useSelector(state => state.activity)

  const groupMarkers = useMemo(() => {
    if(activities.length > 0 ){
    const array = activities.map(activity => (
     {...activity, lat : parseFloat(activity.lat), long: parseFloat(activity.long)}
    ))
   const object = array.reduce((acc, cur) => {
    acc[cur["type"]] = [...acc[cur["type"]] || [], cur];
    return acc;
  }, {})
  let layers =   Object.keys(object).map((key) => [(key), object[key]]);
  if(filter !== ""){
    layers = layers.filter(layer => layer[0] === filter )
  }
  return layers
   }
   }, [activities, filter])

   useEffect(() => {
      dispatch(getActivities())
      dispatch(getBookmarks())
      dispatch(getComments())
   }, [dispatch])

   useEffect(() => {
    setMarkerGroups(groupMarkers)
  }, [groupMarkers])

 
  useEffect(() => {


    if (participeSource) {
      participeSource.close();
    }

    if( user){
      participeSource = new EventSource(`/api/activity/sse/participate/${user.city}`)
      participeSource.addEventListener(`${user.city}`, (e) => {
        const data  = JSON.parse(e.data);
        dispatch(realTimeParticipations(data))
      });

    } 

   
  }, [])

  useEffect(() => {
    if (commentSource) {
      console.log('exist!')
      commentSource.close();
    }

    commentSource = new EventSource(`/api/activity/sse/comments/`)
  
    commentSource.addEventListener("comment", (e) => {
      const data  = JSON.parse(e.data);
      dispatch(realTimeComments(data))
    });
  },  [])

  return (
    <div className='home'>
      {user && (
        <Map center={[user.lat, user.long]} scrollWheelZoom={true} zoom={13} doubleClickZoom={true} zoomControl={true}>
        {markerGroups && markerGroups.map((group) => (
        <CustomLayer key={group[0]} group={group}/>
      ))}
 
        </Map>
      )}
      <OutsideWrapper component="sidebar">
        <Sidebar />
      </OutsideWrapper>
      <OutsideWrapper component="panel">
        <Panel />
        </OutsideWrapper>
        <Modal />
        <OutsideWrapper component="list">
          <List activities={activities} />  
        </OutsideWrapper>
    </div>
  )
}
export default Home