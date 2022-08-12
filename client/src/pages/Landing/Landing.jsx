import { useDispatch, useSelector } from 'react-redux';
import { toggleTest } from '../../features/global/globalSlice';
import "./Landing.scss";

const Landing = () => {
  const dispatch = useDispatch()
  const {test} = useSelector((state) => state.global)

  
  return (
    <div className='landing'>
      Landing
      <div>
      <button onClick={() => dispatch(toggleTest())}>Test reducer</button>
      {test && <div>Hello</div>}
      </div>
      
    </div>
  )
}
export default Landing