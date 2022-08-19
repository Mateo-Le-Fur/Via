import { useSelector } from 'react-redux';
import "./Panel.scss";
const Panel = () => {
 const {panel} = useSelector(state => state.global);
 
  return (
    <div className={panel !== "" ? "panel showPanel": "panel"}>
        <h1>{panel}</h1>
    </div>
  )
}
export default Panel