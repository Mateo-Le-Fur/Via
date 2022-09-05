import { useDispatch, useSelector } from 'react-redux';
import { activePanel, handleHideSidebar } from '../../../features/global/globalSlice';
import {MdOutlineClose} from "react-icons/md"
import {FaUser} from "react-icons/fa"
import {FaPlus} from "react-icons/fa"
import {FaStar} from "react-icons/fa"

import "./Modal.scss";
import Profile from '../../../components/Prorfile/Profile';
import Add from '../../../components/Add/Add';
import Bookmark from '../../../components/Bookmark/Bookmark';
const Modal = () => {
    const {panel} = useSelector(state => state.global);
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch()
  return (
    <div className={panel !== "" ? "modal showModal": "modal"}>
    <span className="leave" onClick={() => {
      dispatch(activePanel(""))
      dispatch(handleHideSidebar())
    }}>
        <MdOutlineClose className='x' />
    </span>
    
         <div className="cover">
         <h1>
         {panel === "profile" && "Profil"}
         {panel === "add" && "Ajouter"}
         {panel === "bookmark" && "Favoris"}
         </h1>
     </div>
 
       
        <div className="container">
        {panel === "profile" && <Profile user={user} />}
          {panel === "add" && <Add />}
          {panel === "bookmark" && <Bookmark />}
        
        </div>
        <div className="actions">
        <li onClick={() => dispatch(activePanel("profile"))}>
            <FaUser className={panel === "profile" ? "icon active": "icon"} />
        </li>
        <li onClick={() => dispatch(activePanel("add"))}>
            <FaPlus  className={panel === "add" ? "icon active": "icon"}/>
        </li>
        <li onClick={() => dispatch(activePanel("bookmark"))}><FaStar className={panel === "bookmark" ? "icon active": "icon"} /></li>
        </div>
    </div>
  )
}
export default Modal