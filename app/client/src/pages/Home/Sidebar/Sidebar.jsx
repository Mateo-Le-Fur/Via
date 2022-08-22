import { useDispatch, useSelector } from 'react-redux';
import "./Sidebar.scss";
import { logout } from '../../../features/auth/authSlice';
import {FaUser} from "react-icons/fa"
import {FaPlus} from "react-icons/fa"
import {FaStar} from "react-icons/fa"
import {FaFilter} from "react-icons/fa"
import {FaGuitar} from "react-icons/fa"
import {FaGamepad} from "react-icons/fa"
import {RiLogoutBoxRFill} from "react-icons/ri"
import { activePanel, activeFilter, handleShowFilter, handleShowSidebar } from '../../../features/global/globalSlice';
import {MdAdminPanelSettings} from "react-icons/md"

const Sidebar = () => {
  const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const {showSidebar, panel, showFilter, filter} = useSelector(state => state.global)
    const handlePanel = (panel) => {
        dispatch(handleShowSidebar())
        dispatch(activePanel(panel))
    }

  return (
    <div className={showSidebar ? "sidebar show": "sidebar"}>
      <ul className='main'>
        <div>
        <li onClick={() => handlePanel('profile')}>
            <FaUser className={panel === "profile" ? "icon active": "icon"} />
        </li>
        <li onClick={() => handlePanel('add')}>
            <FaPlus  className={panel === "add" ? "icon active": "icon"}/>
        </li>
        <li onClick={() => handlePanel("bookmark")}><FaStar className={panel === "bookmark" ? "icon active": "icon"} /></li>
        </div>
        <div>
        <li onClick={() => {
            dispatch(handleShowSidebar())
            dispatch(handleShowFilter())
        }}><FaFilter className={ "icon"} />
        </li>
        </div>
        {showFilter && (
                <ul className='filter'>
                    <li  className="filterLi" onClick={() => dispatch(activeFilter("music"))}>
                        <FaGuitar className={filter === "music" ? "icon filterIcon active": "icon filterIcon"}/>
                    </li>
                    <li  className="filterLi" onClick={() => dispatch(activeFilter("game"))}>
                        <FaGamepad className={filter === "game" ? "icon active filterIcon": "icon filterIcon"}/>
                    </li>
                </ul>
            )}
      </ul>
      <ul className='bottom'>
        {user && user.is_admin && (
          <li onClick={() => handlePanel('dashboard')}>
          <MdAdminPanelSettings  className={panel === "dashboard" ? "icon active": "icon"} />
          </li>
        )}
        <li onClick={() => dispatch(logout())}>
        <RiLogoutBoxRFill className="icon" />
        </li>
      </ul>
    </div>
  )
}
export default Sidebar