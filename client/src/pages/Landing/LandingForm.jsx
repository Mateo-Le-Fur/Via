import Login from "./Forms/Login";
import Register from "./Forms/Register";
import {useState} from "react";
import "./Landing.scss";

const LandingForm = () => {
    const [isMember, setIsMember] = useState(true)
    const toggleMember = () => {
      setIsMember(!isMember)
    }
  return (
    <div className="landingForm">
      <div className="container">
        <div className="logo">
          <img src='/via.png' alt="" />
        </div>
        <div className={isMember ? "form form--member": "form" }>
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