import { useDispatch, useSelector } from 'react-redux';
import { activePanel } from '../../../features/global/globalSlice';
import {MdOutlineClose} from "react-icons/md";
import "./Panel.scss";
const Panel = () => {
 const {panel} = useSelector(state => state.global);
 const dispatch = useDispatch()
  return (
    <div className={panel !== "" ? "panel showPanel": "panel"}>
        <span className="leave" onClick={() => dispatch(activePanel(""))}>
        <MdOutlineClose className='x' />
    </span>
        <h1>{panel}</h1>
    </div>
  )
}
export default Panel