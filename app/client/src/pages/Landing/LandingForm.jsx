import Login from "./Forms/Login";
import Register from "./Forms/Register";
import {useState} from "react";
import "./Landing.scss";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import { checkUser, reset } from '../../features/auth/authSlice';

const LandingForm = () => {
    const [isMember, setIsMember] = useState(true)
    const toggleMember = () => {
      setIsMember(!isMember)
    }
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {isLoading ,user, message} = useSelector(state => state.auth)




    useEffect(() => {
      if(message){
        setTimeout(() => {
          dispatch(reset())
        }, 3000)
      }
      
      if(!isLoading && user){
        navigate("/home")
      }
      
    }, [user, message, isLoading, navigate, dispatch])



  return (
    <div className="landingForm">
      <div className="container">
        <div className="logo">
          <img src='/via.png' alt="" />
        </div>
        <div className="form">
          {message && <p className='server-error'></p>}
          {isMember ? (
            <Login />
          ) : (
            <Register />
          )}
        </div>
      </div>
      <p className='isMember'>
        {isMember ? "Pas encore inscrit ?" : "Vous avez déjà un compte ?"}
        <button type="button" onClick={toggleMember} className="member-btn">
          {isMember ? "S'inscrire" : "Se connecter"}
        </button>
      </p>
    </div>
  )
}
export default LandingForm
