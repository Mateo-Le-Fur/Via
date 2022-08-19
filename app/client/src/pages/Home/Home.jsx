import { useDispatch } from 'react-redux'

import { logout } from '../../features/auth/authSlice'
import "./Home.scss"

const Home = () => {
  const dispatch = useDispatch()

  return (
    <div className='home'>
      <button onClick={() =>   dispatch(logout())}>
        Logout
      </button>
    </div>
  )
}
export default Home