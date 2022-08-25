import React, { memo, useEffect, useMemo, useRef} from 'react'
import { Marker, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
// import { getActivity } from '../../store/activity/activitySlice'
import "./Map.scss"
import CustomPopup from './CustomPopup'
import getIcons from "./getIcons"
import { getActivity } from '../../features/activity/activitySlice'
import { getUser } from '../../features/user/userSlice'
import { useSelect } from '@mui/base'

const CustomMarker = ({marker, type} ) => {

const icon = getIcons(type)
const {activity} = useSelector(state => state.activity)
const {user} = useSelector(state => state.user)

  const dispatch = useDispatch()

    let markerRef = useRef()
  
    const eventHandlers = useMemo(
      () => ({
        click() {
         dispatch(getActivity(marker.id))
        },
      }),
      [ dispatch, marker.id],
    )

    const map = useMap();
  

    useEffect(() => {
      if ( marker.id === activity.id && marker.lat && marker.long) {
        map.flyTo([activity.lat, activity.long])
        markerRef.current.openPopup()
      }

      if(activity.user_id){
        dispatch(getUser(activity.user_id))
      }

    }, [activity, dispatch, map, marker]);
  
  
   if(marker.lat && marker.long) return (
      <Marker
      ref={markerRef}
      eventHandlers={eventHandlers}
      position={[marker.lat, marker.long]}
      icon={icon}
    >
      <CustomPopup type={type} id={marker.id} activity={activity} user={user}/>
  
    </Marker>

    )
  }


  export default memo(CustomMarker)