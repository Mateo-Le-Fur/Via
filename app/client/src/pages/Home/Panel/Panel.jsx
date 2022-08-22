import { useDispatch, useSelector } from 'react-redux';
import { activePanel, handleHideSidebar } from '../../../features/global/globalSlice';
import {MdOutlineClose} from "react-icons/md";
import "./Panel.scss";
import Profile from '../../../components/Prorfile/Profile';
import Add from '../../../components/Add/Add';
import Bookmark from '../../../components/Bookmark/Bookmark';
import Dashboard from '../../../components/Dashboard/Dashboard';
const Panel = () => {
 const {panel} = useSelector(state => state.global);
 const dispatch = useDispatch()
  return (
    <div className={panel !== "" ? "panel showPanel": "panel"}>
    <span className="leave" onClick={() => {
      dispatch(activePanel(""))
      dispatch(handleHideSidebar())
    }}>
        <MdOutlineClose className='x' />
    </span>
        <div className="cover">
        <h1>
            {panel === "profile" && "Profil"}
            {panel === "add" && "Ajouter une activité"}
            {panel === "bookmark" && "Favoris"}
            {panel === "dashboard" && "Tableau de bord"}
            </h1>
        </div>
        <div className="container">
          {panel === "profile" && <Profile />}
          {panel === "add" && <Add />}
          {panel === "bookmark" && <Bookmark />}
          {panel === "dashboard" && <Dashboard />}
        </div>
    </div>
  )
}
export default Panel