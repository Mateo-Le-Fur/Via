import { useDispatch, useSelector } from 'react-redux';
import { toggleTest } from '../../features/global/globalSlice';
import { useEffect } from 'react';
import './Landing.scss';
import axios from "axios"

const Landing = () => {
  const dispatch = useDispatch();
  const { test } = useSelector((state) => state.global);

  useEffect(() => {
    const login = async () => {
      const res = await axios.get("/login")
      console.log(res.data)
    }

    login()
  }, []);

  return (
    <div className='landing'>
      Landing
      <div>
        <button onClick={() => dispatch(toggleTest())}>Test reducer</button>
        {test && <div>Hello</div>}
      </div>
    </div>
  );
};
export default Landing;
