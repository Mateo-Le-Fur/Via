import { useState } from 'react';
import "./Add.scss";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fr } from "react-date-range/src/locale";
import { Calendar } from 'react-date-range'; 
import { FaLeaf, FaFootballBall, FaHandsHelping, FaTools} from "react-icons/fa"
import {GiCook, GiPalette, } from "react-icons/gi"


const Add = () => {

  const [form, setForm] = useState({
    name: "",
    address: "",
    date: "",
    type: "",
    description: ""
})

const today = new Date()

const [date, setDate] = useState(today)
const [type, setType] = useState("charity")


const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
}


const handleSubmit = (e) => {
  e.preventDefault()
}

  return (
    <div className='add'>
        <p className='server-error'>server error</p>
      <form className='editForm' onSubmit={handleSubmit}>
      <div className={form.name.length > 0 ? "field field--has-content" : "field"}>
            <input className='field-input' name="name" type="text" id="name" value={form.nickname} placeholder="Nom de l'activité" onChange={handleChange} />
            <label className='field-label' htmlFor="firstname">Nom de l'activité</label>
        </div>
         <div className={form.address.length > 0 ? "field field--has-content" : "field"}>
            <input value={form.address} name="addeess" className='field-input' type="text" id="address" placeholder='Adresse'  onChange={handleChange} />
            <label htmlFor="lastname" className="field-label">Adresse</label>
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
                <div onClick={() => setType("charity")}>
                <FaHandsHelping  className={type === "charity" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setType("art")}>
                  <GiPalette className={type === "art" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setType("cook")}>
                  <GiCook className={type === "cook" ? "icon active": "icon"}/>
                </div>
                <div onClick={() => setType("gardening")}><FaLeaf className={type === "gardening" ? "icon active": "icon"}/></div>
                <div onClick={() => setType("diy")}>
                  <FaTools className={type === "diy" ? "icon active": "icon"} />
                </div>
                <div onClick={() => setType("sport")}>
                  <FaFootballBall className={type === "sport" ? "icon active": "icon"}/>
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