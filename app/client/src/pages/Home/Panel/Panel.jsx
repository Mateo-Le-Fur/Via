import { useDispatch, useSelector } from 'react-redux';
import { activePanel, handleHideSidebar } from '../../../features/global/globalSlice';
import {MdOutlineClose} from "react-icons/md";
import "./Panel.scss";
import Profile from '../../../components/Prorfile/Profile';
import Add from '../../../components/Add/Add';
import Bookmark from '../../../components/Bookmark/Bookmark';
import Dashboard from '../../../components/Dashboard/Dashboard';
import Chat from '../../../components/Chat/Chat';
const Panel = () => {
 const {panel} = useSelector(state => state.global);
 const dispatch = useDispatch()
 const {user} = useSelector(state => state.user);
  return (
    <div className={panel !== "" ? "panel showPanel": "panel"}>
    <span className="leave" onClick={() => {
      dispatch(activePanel(""))
      dispatch(handleHideSidebar())
    }}>
        <MdOutlineClose className='x' />
    </span>
      {panel !== "profile" && (
           <div className="cover">
           {panel === "add" && <h1>Ajouter une activité</h1>}
           {panel === "bookmark" && <h1>Favoris</h1>}
           {panel === "dashboard" && <h1>Tableau de bord</h1>}
           {panel === "chat" && <h1>Conversations</h1>}

       </div>
      )}  
        <div className="container">
          {panel === "profile" && <Profile user={user} />}
          {panel === "add" && <Add />}
          {panel === "bookmark" && <Bookmark />}
          {panel === "dashboard" && <Dashboard />}
          {panel === "chat" && <Chat />}
        </div>
    </div>
  )
}
export default Panel