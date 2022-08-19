import { Marker, Popup } from 'react-leaflet'
import { useSelector } from 'react-redux'
import Map from '../../components/Map/Map'
import "./Home.scss"
import Sidebar from './Sidebar/Sidebar'

const Home = () => {
  const {user} = useSelector(state => state.auth)
  return (
    <div className='home'>
    {user && (
      <Map center={[user.lat, user.long]} zoom={13} zoomControl={true}>
      <Marker  position={[user.lat, user.long]}>
            <Popup>
              Hello {user.nickname} you are in {user.city }
            </Popup>
        </Marker>
      </Map>
    )}
    <Sidebar />
    </div>
  )
}
export default Home