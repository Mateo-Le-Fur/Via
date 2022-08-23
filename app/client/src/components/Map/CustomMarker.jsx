import React, { memo, useMemo, useRef} from 'react'
import { Marker } from 'react-leaflet'
import { useDispatch } from 'react-redux'
// import { getActivity } from '../../store/activity/activitySlice'
import "./Map.scss"
import CustomPopup from './CustomPopup'
import getIcons from "./getIcons"

const CustomMarker = ({marker, type} ) => {

const icon = getIcons(type)

  const dispatch = useDispatch()

    let markerRef = useRef()
  
    const eventHandlers = useMemo(
      () => ({
        click() {
          (console.log(marker.id))
        },
      }),
      [ marker.id],
    )
  
  
    return (
      <Marker
      ref={markerRef}
      eventHandlers={eventHandlers}
      position={[marker.location[0], marker.location[1]]}
      icon={icon}
    >
      <CustomPopup type={type} id={marker.id}/>
  
    </Marker>
    )
  }


  export default memo(CustomMarker)