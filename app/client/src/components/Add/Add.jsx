import { useEffect, useState } from 'react';
import "./Add.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fr } from "react-date-range/src/locale";
import { Calendar } from 'react-date-range'; 
import { FaLeaf, FaFootballBall, FaHandsHelping, FaTools} from "react-icons/fa"
import {GiCook, GiPalette, } from "react-icons/gi"
import { useDispatch, useSelector } from 'react-redux';
import { createActivity, reset } from '../../features/activity/activitySlice';
import SuggestionBox from './SeuggestionBox';
import { activePanel, handleHideSidebar, handleHideSuggestionBox, handleShowSuggestionBox } from '../../features/global/globalSlice';
import OutsideWrapper from '../../hooks/ClickOutsideHook'

const Add = () => {
  const {showSuggestionBox} = useSelector(state => state.global)

  const {isSuccess, isError, message} = useSelector(state => state.activity)

  const [form, setForm] = useState({
    name: "",
    description: ""
})

const today = new Date()

const [date, setDate] = useState(today)
const [type, setType] = useState("Bénévolat")
const dispatch = useDispatch()

const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
}

const [address, setAddress] = useState("")

const handleSubmit = (e) => {
  e.preventDefault()
  console.log({...form, type, date})
    dispatch(createActivity({...form, type, date, address}))
}
  useEffect(() => {
    if(message && isError){
      setTimeout(() => {
     
        dispatch(reset())
      }, 3000)
    }

    if(isSuccess){
      dispatch(activePanel(""))
      dispatch(handleHideSidebar())
      dispatch(reset())
    }
 
    
  }, [message, isError, isSuccess, dispatch])




  const  [inputAddress, setInputAddress] = useState("");


  const handleChangeAddress = (e) => {
    setInputAddress(e.target.value)
    if(e.target.value.length > 0 ){
      dispatch(handleShowSuggestionBox())
    } else {
      dispatch(handleHideSuggestionBox())
    }
  }

  const handleAddress = (value) => {
    setInputAddress(value)
    setAddress(value)
  }



  return (
    <div className='add'>
    {isError && message &&  <p className='server-error'>{message}</p> }
      <form className='editForm' onSubmit={handleSubmit}>
      <div className="field">
            <input className='field-input' name="name" type="text" id="name" value={form.nickname} placeholder="Nom de l'activité" onChange={handleChange} />
        </div>
         <div className= "field field-address">
            <input value={inputAddress}  className='field-input' type="text" id="address" placeholder='Adresse'  onChange={handleChangeAddress} />
            {showSuggestionBox &&    <SuggestionBox inputAddress={inputAddress} handleAddress={handleAddress}/>}
        </div>
        <div className='areaContainer'>
              <textarea onChange={handleChange} value={form.description} name="description" id="description" placeholder='Description'></textarea>
        </div>
        <div className='dateContainer'> 
            <Calendar
              locale={fr}
              editableDateInputs={true}
              onChange={(item) =>
                setDate(item)
              }
              moveRangeOnFirstSelection={false}
              date={date}
              className="date"
              minDate={new Date()}
            />
        </div>
        <div className='typeContainer'> 
            <span>Type d'activité</span>
            <div className="activityList">
                <div onClick={() => setType("Bénévolat")}>
                <FaHandsHelping  className={type === "Bénévolat" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setType("Arts")}>
                  <GiPalette className={type === "Arts" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setType("Cuisine")}>
                  <GiCook className={type === "Cuisine" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setType("Jardinage")}><FaLeaf className={type === "Jardinage" ? "icon active": "icon"}/></div>
                <div onClick={() => setType("Bricolage")}>
                  <FaTools className={type === "Bricolage" ? "icon active": "icon"} />
                </div>
                <div onClick={() => setType("Danse")}>
                  <FaFootballBall className={type === "Danse" ? "icon active": "icon"}/>
                </div>
            </div>
        </div>
        <div className='buttonContainer'>
          <button type="submit" className="btn">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}
export default Add