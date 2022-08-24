import { Marker, Popup } from 'react-leaflet'
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
import {activitiesData} from "./data"
import { getActivities } from '../../features/activity/activitySlice'

const Home = () => {
  const { user } = useSelector(state => state.auth)
  const [markerGroups, setMarkerGroups] = useState([])
  const dispatch = useDispatch()
  const {activities} = useSelector(state => state.activity)

  const groupMarkers = useMemo(() => {
    if(activities.length > 0 ){
    const array = activities.map(activity => (
     {...activity, lat : parseFloat(activity.lat), long: parseFloat(activity.long)}
    ))
   const object = array.reduce((acc, cur) => {
    acc[cur["type"]] = [...acc[cur["type"]] || [], cur];
    return acc;
  }, {})
  return  Object.keys(object).map((key) => [(key), object[key]]);
   }
   }, [activities])

   useEffect(() => {
      dispatch(getActivities())
   }, [dispatch])

   useEffect(() => {
    setMarkerGroups(groupMarkers)
  }, [groupMarkers])

  console.log(markerGroups)

  return (
    <div className='home'>
      {user && (
        <Map center={[user.lat, user.long]} zoom={13} zoomControl={true}>
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