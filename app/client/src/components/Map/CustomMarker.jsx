import React, { memo, useEffect, useMemo, useRef } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import "./Map.scss"
import CustomPopup from './CustomPopup'
import getIcons from "./getIcons"
import { getActivity } from '../../features/activity/activitySlice'

const CustomMarker = ({ marker, type }) => {

  const icon = getIcons(type)

  const dispatch = useDispatch()
  let markerRef = useRef()

  // Get activity on Click
  const eventHandlers = useMemo(
    () => ({
      click() {
        dispatch(getActivity(marker.id))
      },
    }),
    [dispatch, marker.id],
  )

  const { activity } = useSelector(state => state.activity)

  // Fly to and open popup
  const map = useMap();

  useEffect(() => {
    if (marker.id === activity.id && marker.lat && marker.long) {
      map.flyTo([activity.lat, activity.long])
      markerRef.current.openPopup()
    }
  }, [activity, map, marker]);


  if (marker.lat && marker.long) return (
    <Marker
      ref={markerRef}
      eventHandlers={eventHandlers}
      position={[marker.lat, marker.long]}
      icon={icon}
    >
      <CustomPopup type={type} id={marker.id} />
    </Marker>
  )
}

export default memo(CustomMarker)