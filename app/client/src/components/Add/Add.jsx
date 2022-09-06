import { useEffect, useState } from 'react';
import "./Add.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaLeaf, FaFootballBall, FaHandsHelping, FaTools } from "react-icons/fa"
import { GiCook, GiPalette, } from "react-icons/gi"
import { useDispatch, useSelector } from 'react-redux';
import { createActivity, reset } from '../../features/activity/activitySlice';
import SuggestionBox from './SeuggestionBox';
import { activePanel, handleHideSidebar, handleHideSuggestionBox, handleShowSuggestionBox } from '../../features/global/globalSlice';
import { RiFileEditFill } from "react-icons/ri"
import { HiCalendar, HiInformationCircle, HiLocationMarker } from "react-icons/hi"
import { BsFillTagsFill } from "react-icons/bs"

const Add = () => {

  const { showSuggestionBox } = useSelector(state => state.global)
  const { isSuccess, isError, message } = useSelector(state => state.activity)
  const dispatch = useDispatch()

  // Form
  const [form, setForm] = useState({
    name: "",
    description: ""
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Type 
  const [type, setType] = useState("Bénévolat")


  // address
  const [address, setAddress] = useState("")

  const [inputAddress, setInputAddress] = useState("");

  const handleChangeAddress = (e) => {
    setInputAddress(e.target.value)
    if (e.target.value.length > 0) {
      dispatch(handleShowSuggestionBox())
    } else {
      dispatch(handleHideSuggestionBox())
    }
  }

  const handleAddress = (value) => {
    setInputAddress(value)
    setAddress(value)
  }


  // date
  var now = new Date();
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + '-' + month + '-' + day;

  const [date, setDate] = useState(today)

  const handleDate = (e) => {
    setDate(e.target.value)
  }

  // submit
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ ...form, type, date })
    dispatch(createActivity({ ...form, type, date, address }))
  }

  useEffect(() => {
    if (message && isError) {
      setTimeout(() => {

        dispatch(reset())
      }, 3000)
    }

    if (isSuccess) {
      dispatch(activePanel(""))
      dispatch(handleHideSidebar())
      dispatch(reset())
    }

  }, [message, isError, isSuccess, dispatch])

  return (
    <div className='add'>
      {isError && message && <p className='server-error'>{message}</p>}
      <form className='editForm' onSubmit={handleSubmit}>
        <div className="field-add">
          <RiFileEditFill className="smIcon" />
          <input className='add-input' name="name" type="text" id="name" value={form.nickname} placeholder="Nom de l'activité" onChange={handleChange} />
        </div>
        <div className="field-add ">
          <HiCalendar className='smIcon' />
          <input type='date' className='add-input' onChange={handleDate} />
        </div>
        <div className="field-add field-address">
          <HiLocationMarker className='smIcon' />
          <input autoComplete="off" value={inputAddress} className='add-input' type="text" id="address" placeholder='Adresse' onChange={handleChangeAddress} />
          {showSuggestionBox && <SuggestionBox inputAddress={inputAddress} handleAddress={handleAddress} />}
        </div>
        <div className='field-add field-types'>
          <BsFillTagsFill className='smIcon' />
          <div className='types-container'>
            <div onClick={() => setType("Bénévolat")}>
              <FaHandsHelping className={type === "Bénévolat" ? "icon active" : "icon"} />
            </div>
            <div onClick={() => setType("Arts")}>
              <GiPalette className={type === "Arts" ? "icon active" : "icon"} />
            </div>
            <div onClick={() => setType("Cuisine")}>
              <GiCook className={type === "Cuisine" ? "icon active" : "icon"} />
            </div>
            <div onClick={() => setType("Jardinage")}><FaLeaf className={type === "Jardinage" ? "icon active" : "icon"} /></div>
            <div onClick={() => setType("Bricolage")}>
              <FaTools className={type === "Bricolage" ? "icon active" : "icon"} />
            </div>
            <div onClick={() => setType("Danse")}>
              <FaFootballBall className={type === "Danse" ? "icon active" : "icon"} />
            </div>
          </div>
        </div>
        <div className="areaContainer">
          <HiInformationCircle className="smIcon" />
          <textarea
            onChange={handleChange}
            value={form.description}
            name="description"
            id="description"
            placeholder="Description"
          ></textarea>
        </div>
        <div className='buttonContainer'>
          <button type="submit" className="btn">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}

export default Add