import { Marker, Popup } from 'react-leaflet'
import { useSelector } from 'react-redux'
import Map from '../../components/Map/Map'
import OutsideWrapper from '../../hooks/ClickOutsideHook'
import "./Home.scss"
import Panel from './Panel/Panel'
import Sidebar from './Sidebar/Sidebar'
import Modal from "./Modal/Modal"
import List from './List/List'

const Home = () => {
  const { user } = useSelector(state => state.auth)
  return (
    <div className='home'>
      {user && (
        <Map center={[user.lat, user.long]} zoom={13} zoomControl={true}>
          <Marker position={[user.lat, user.long]}>
            <Popup>
              Hello {user.nickname} you are in {user.city}
            </Popup>
          </Marker>
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
          <List />  
        </OutsideWrapper>
    </div>
  )
}
export default Home