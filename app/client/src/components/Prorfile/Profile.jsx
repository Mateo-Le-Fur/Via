import { useState } from 'react';
import './Profile.scss';
import img from "../../assets/images/no-user.png"
import Card from "../Card/Card";


const Profile = () => {

const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    description: ""
})

const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
}

const [file, setFile] = useState("")

const handleSubmit = (e) => {
  e.preventDefault()
}
  return (
    <div className='profile'>
      {/* <p className='server-error'>server error</p> */}
      <form className='editForm' onSubmit={handleSubmit}>
      <div className='avatar'>
        <input type="file" id="avatar"                   onChange={(e) => setFile(e.target.files[0])}
 name="avatar" />
        <label htmlFor="avatar">
        <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : img
              }
              alt="avatar"
            />
        </label>
      </div>
      <div className={form.firstname.length > 0 ? "field field--has-content" : "field"}>
            <input className='field-input' name="firstname" type="text" id="firstname" value={form.nickname} placeholder="Prénom" onChange={handleChange} />
            <label className='field-label' htmlFor="firstname">Prénom</label>
        </div>
         <div className={form.lastname.length > 0 ? "field field--has-content" : "field"}>
            <input value={form.lastname} name="lastname" className='field-input' type="text" id="lastname" placeholder='Nom'  onChange={handleChange} />
            <label htmlFor="lastname" className="field-label">Nom</label>
        </div>
        <div className={form.address.length > 0 ? "field field--has-content" : "field"}>
            <input value={form.address} name="address" className='field-input' type="text" id="address" placeholder='Adresse'  onChange={handleChange} />
            <label htmlFor="address" className="field-label">Addresse</label>
        </div>
        <div className={form.phone.length > 0 ? "field field--has-content" : "field"}>
            <input value={form.phone} name="phone" className='field-input' type="text" id="phone" placeholder='Téléphone'  onChange={handleChange} />
            <label htmlFor="phone" className="field-label">Téléphone</label>
        </div>
        <div className='areaContainer'>
              <textarea onChange={handleChange} value={form.description} name="description" id="description" placeholder='Description'></textarea>
        </div>
        <div className='buttonContainer'>
          <button type="submit" className="btn">Enregistrer</button>
        </div>
      </form>
        <h2>Mes activités</h2>
      <div className="activityList">
        <Card type="profile" />
        <Card type="profile" />
        <Card type="profile" />
        <Card type="profile" />
        <Card type="profile" />
        <Card type="profile" />
        <Card type="profile" />
        <Card type="profile" />
      </div>
    </div>
  );
};
export default Profile;
