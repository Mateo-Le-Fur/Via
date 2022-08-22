import { useState } from 'react';
import './Profile.scss';
import img from "../../assets/images/no-user.png"

const Profile = () => {

const [form, setForm] = useState({
    nickname: "",
    email: "",
    address: ""
})

const handleChange = (e) => {
    setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
}

const [file, setFile] = useState("")
  return (
    <div className='profile'>
      <p className='server-error'>server error</p>
      <form className='editForm'>
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
      <div className={form.nickname.length > 0 ? "field field--has-content" : "field"}>
            <input className='field-input' name="nickname" type="text" id="nickname" value={form.nickname} placeholder="Pseudo" onChange={handleChange} />
            <label className='field-label' htmlFor="nickname">Nickname</label>
        </div>
         <divv className={form.email.length > 0 ? "field field--has-content" : "field"}>
            <input value={form.email} name="email" className='field-input' type="text" id="email" placeholder='Email'  onChange={handleChange} />
            <label htmlFor="email" className="field-label">Email</label>
        </divv>
        <divv className={form.address.length > 0 ? "field field--has-content" : "field"}>
            <input value={form.address} name="address" className='field-input' type="text" id="address" placeholder='Adresse'  onChange={handleChange} />
            <label htmlFor="address" className="field-label">Addresse</label>
        </divv>
      </form>
    </div>
  );
};
export default Profile;
