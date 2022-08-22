import { useDispatch, useSelector } from 'react-redux';
import { activePanel } from '../../../features/global/globalSlice';
import {MdOutlineClose} from "react-icons/md"
import {FaUser} from "react-icons/fa"
import {FaPlus} from "react-icons/fa"
import {FaStar} from "react-icons/fa"

import "./Modal.scss";
const Modal = () => {
    const {panel} = useSelector(state => state.global);
    const dispatch = useDispatch()
  return (
    <div className={panel !== "" ? "modal showModal": "modal"}>
    <span className="leave" onClick={() => dispatch(activePanel(""))}>
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
            hello
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